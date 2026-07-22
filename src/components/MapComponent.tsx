"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import "leaflet/dist/leaflet.css";
import {GeoJSON, MapContainer, TileLayer} from "react-leaflet";
import type {Feature, FeatureCollection} from 'geojson';
import {MapAutoZoom} from "@/src/components/MapAutoZoom";
import {useCallback} from "react";
import {Layer} from "leaflet";

interface MapComponentProps {
    location: [number, number];
    activities?: FeatureCollection;
    parks?: FeatureCollection;
    cities?: FeatureCollection;
}

const activityStyle = {
    color: 'orange',
    weight: 3,
    opacity: 0.7,
    dashArray: '8 6',
}

const cityStyle = {
    color: 'blue',
    weight: 1,
    opacity: 0.7,
}

const parkStyle = {
    color: 'green',
    weight: 1,
    opacity: 0.7,
}

const paperStyle = {
    height: 500,
    width: "100%",
    mt: 2,
    overflow: "hidden",
}

const boxStyle = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

export default function MapComponent({location, activities, parks, cities}: MapComponentProps) {

    const onEachCity = useCallback((feature: Feature, layer: Layer) => {
        layer.bindPopup(feature.properties?.name ?? "Unknown city");
    }, []);

    const onEachPark = useCallback((feature: Feature, layer: Layer) => {
        layer.bindPopup(feature.properties?.name ?? "Unknown park");
    }, []);

    return (
        <Paper elevation={3} sx={paperStyle}>
            <Box sx={boxStyle}>
                <MapContainer
                    center={location}
                    zoom={13}
                    zoomSnap={1}
                    zoomDelta={1}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    {activities &&
                        <MapAutoZoom
                            key={activities.features.length}
                            activities={activities}
                            cities={cities}
                            parks={parks}/>}
                    {cities && <GeoJSON
                        data={cities}
                        style={cityStyle}
                        onEachFeature={onEachCity}/>}
                    {parks && <GeoJSON
                        data={parks}
                        style={parkStyle}
                        onEachFeature={onEachPark}/>}
                    {activities && <GeoJSON
                        data={activities}
                        style={activityStyle}/>}
                </MapContainer>
            </Box>
        </Paper>
    );
}