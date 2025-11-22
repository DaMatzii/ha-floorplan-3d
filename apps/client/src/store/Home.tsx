import { HassConnect, useStore, useHass } from "@hakit/core";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/utils/apiInstance";
import axios from "axios";
import { HomeConfig, Building } from "@/types";
import { useHomeStore } from "@/store/HomeStore";
import { XMLParser } from "fast-xml-parser";
import HomeView from "@/view/HomeView";

import { parse } from "yaml";

function SomeComponent() {
  const connection = useHass();

  return (
    <div>
      <h1>HassConnect Status</h1>
      <p>Status: {connection ? "Connected" : "Disconnected"}</p>
    </div>
  );
}

function Loading() {
  return <p>Loading</p>;
}

export default function Home({ children }) {
  //Load home.yaml --> load buildings --> parse --> save to zustand store

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setHome } = useHomeStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const homePromise = api.get<HomeConfig>("./api/home");
        const buildingPromise = api.get<any>("./api/building/0");

        const [homeResponse, buildingResponse] = await Promise.all([
          homePromise,
          buildingPromise,
        ]);

        const rooms = parse(buildingResponse.data.raw_rooms);

        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const floorplan = parser.parse(
          buildingResponse.data.floorplan_building,
        )?.home;

        const building: Building = {
          title: buildingResponse.data.title,
          floorplan_name: buildingResponse.data.floorplan,
          rooms: rooms,
        };
        console.log(building);

        setHome(homeResponse.data, [building], {
          [buildingResponse.data.floorplan]: floorplan,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <HassConnect
        hassUrl="http://192.168.2.101:8123"
        hassToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwZjJiMzgyMWQzYjA0M2M5OWI0ODI2NmFkZDk2MWEzNiIsImlhdCI6MTc1NTg3NjA2MiwiZXhwIjoyMDcxMjM2MDYyfQ.YaVKgKD5dhxWg4nSQSa-1mphzG2rXXj_yAXg1sQP9VU"
        loading={<Loading />}
      >
        {isLoading ? <Loading /> : children}
      </HassConnect>
    </>
  );
}
