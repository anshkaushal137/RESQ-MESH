import React, { useState, useEffect } from "react";
import { MapPin, Search, Navigation, Loader2 } from "lucide-react";

export default function LocationPicker({ onLocationSelect }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [floorLandmark, setFloorLandmark] = useState("");
    const [statusMsg, setStatusMsg] = useState("");

    // Live address search (Photon API + Nominatim Fallback)
    useEffect(() => {
        if (query.trim().length < 3) {
            setSuggestions([]);
            setStatusMsg("");
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            setStatusMsg("Searching locations...");

            try {
                // Engine 1: Photon (Super-fast OpenStreetMap API, no CORS blocks)
                const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
                    query.trim()
                )}&limit=5&lang=en`;

                const res = await fetch(photonUrl);
                const data = await res.json();

                if (data && data.features && data.features.length > 0) {
                    const formatted = data.features.map((item, idx) => {
                        const props = item.properties || {};
                        const coords = item.geometry?.coordinates || [0, 0];
                        const name = props.name || props.street || query;
                        const context = [props.city || props.district, props.state, props.country]
                            .filter(Boolean)
                            .join(", ");

                        return {
                            id: idx,
                            title: name,
                            subtitle: context || "India",
                            displayName: context ? `${name}, ${context}` : name,
                            lat: coords[1],
                            lon: coords[0],
                        };
                    });

                    setSuggestions(formatted);
                    setStatusMsg("");
                    setLoading(false);
                    return;
                }

                // Engine 2: Nominatim Fallback
                const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query.trim()
                )}&limit=5&countrycodes=in`;

                const nomRes = await fetch(nomUrl);
                const nomData = await nomRes.json();

                if (Array.isArray(nomData) && nomData.length > 0) {
                    const formatted = nomData.map((item) => ({
                        id: item.place_id,
                        title: item.name || query,
                        subtitle: item.display_name,
                        displayName: item.display_name,
                        lat: parseFloat(item.lat),
                        lon: parseFloat(item.lon),
                    }));
                    setSuggestions(formatted);
                    setStatusMsg("");
                } else {
                    setSuggestions([]);
                    setStatusMsg("No locations found. Try adding city (e.g. Kalyanpur Kanpur)");
                }
            } catch (err) {
                console.error("Search error:", err);
                setStatusMsg("Search API unreachable. Please use GPS button below or type landmark.");
            } finally {
                setLoading(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle suggestion click
    const handleSelect = (item) => {
        const locObj = {
            displayName: item.displayName,
            area: item.title,
            city: item.subtitle,
            lat: item.lat,
            lon: item.lon,
        };
        setSelectedDetails(locObj);
        setQuery(item.displayName);
        setSuggestions([]);
        setStatusMsg("");
        if (onLocationSelect) onLocationSelect({ ...locObj, floorLandmark });
    };

    // GPS handler
    const handleGps = () => {
        if (!navigator.geolocation) {
            alert("Browser GPS support nahi karta.");
            return;
        }
        setLoading(true);
        setStatusMsg("Locking GPS satellite coordinates...");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                const locObj = {
                    displayName: `GPS Verified Target (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
                    area: "GPS Auto-Lock",
                    city: "Local Sector",
                    lat: lat,
                    lon: lon,
                };
                setSelectedDetails(locObj);
                setQuery(`GPS Lock: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
                setSuggestions([]);
                setStatusMsg("");
                setLoading(false);
                if (onLocationSelect) onLocationSelect({ ...locObj, floorLandmark });
            },
            (err) => {
                setLoading(false);
                setStatusMsg("GPS denied. Please type landmark manually.");
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", width: "100%", position: "relative" }}>
            {/* Search Bar */}
            <div style={{ position: "relative", width: "100%" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#080c16",
                        border: "1px solid rgba(6, 182, 212, 0.4)",
                        borderRadius: "6px",
                        padding: "0.6rem 0.85rem",
                        gap: "0.6rem",
                    }}
                >
                    <Search style={{ width: 16, height: 16, color: "#38bdf8", flexShrink: 0 }} />
                    <input
                        type="text"
                        style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#ffffff",
                            fontSize: "0.85rem",
                            width: "100%",
                        }}
                        placeholder="Type colony, sector, or city (e.g. Kalyanpur)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {loading && <Loader2 style={{ width: 16, height: 16, color: "#38bdf8", animation: "spin 1s linear infinite" }} />}
                </div>

                {/* Dropdown Suggestions List */}
                {suggestions.length > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            marginTop: "4px",
                            background: "#0d1527",
                            border: "2px solid #06b6d4",
                            borderRadius: "6px",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.9)",
                            zIndex: 99999,
                            maxHeight: "220px",
                            overflowY: "auto",
                        }}
                    >
                        {suggestions.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                style={{
                                    padding: "0.65rem 0.85rem",
                                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "0.6rem",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#1e293b")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <MapPin style={{ width: 16, height: 16, color: "#06b6d4", marginTop: 2, flexShrink: 0 }} />
                                <div style={{ overflow: "hidden" }}>
                                    <div style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 700 }}>
                                        {item.title}
                                    </div>
                                    <div style={{ color: "#94a3b8", fontSize: "0.72rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item.subtitle}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {statusMsg && (
                <span style={{ fontSize: "0.72rem", color: "#38bdf8", fontFamily: "monospace" }}>
                    {statusMsg}
                </span>
            )}

            {/* GPS Button & Coordinate Lock Pill */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <button
                    type="button"
                    onClick={handleGps}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "rgba(6, 182, 212, 0.15)",
                        border: "1px solid rgba(6, 182, 212, 0.5)",
                        color: "#38bdf8",
                        padding: "0.45rem 0.8rem",
                        borderRadius: "4px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    <Navigation style={{ width: 13, height: 13 }} />
                    Use My Current Location
                </button>

                {selectedDetails && (
                    <span style={{ fontSize: "0.72rem", color: "#34d399", fontFamily: "monospace", fontWeight: 700 }}>
                        ✓ Locked: {selectedDetails.lat.toFixed(4)}, {selectedDetails.lon.toFixed(4)}
                    </span>
                )}
            </div>

            {/* Floor / Landmark */}
            <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8", marginBottom: "0.3rem" }}>
                    Exact Flat / Floor / Landmark *
                </label>
                <input
                    type="text"
                    placeholder="e.g. 2nd Floor Balcony, Near Water Tank"
                    value={floorLandmark}
                    onChange={(e) => {
                        setFloorLandmark(e.target.value);
                        if (onLocationSelect && selectedDetails) {
                            onLocationSelect({ ...selectedDetails, floorLandmark: e.target.value });
                        }
                    }}
                    style={{
                        width: "100%",
                        background: "#080c16",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "6px",
                        padding: "0.55rem 0.75rem",
                        color: "#ffffff",
                        fontSize: "0.82rem",
                        outline: "none",
                    }}
                />
            </div>
        </div>
    );
}