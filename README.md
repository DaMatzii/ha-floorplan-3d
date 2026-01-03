<h1 align="center"> Ha floorplan 3d  </h1>
<h3 align="center">Interactive 3d floorplan for controlling your Home Assistant</h3>

<p align="center"> 
  <img src="https://placehold.co/600x200/000000/ffffff alt="Black placeholder">
</p>

## Features

- Rendering floorplan based on Swet Home 3D file (.sh3d)


## Table of Contents

- [🖤 Introduction](#-features)
- [📦 Getting started](#-installation)
- [🧪 Configuring](#-usage)
  - [Sub category](#stop-any-running-project)




# Configuration
```yaml
title: "Home"oorplan_name: "home.xml"

rooms:
  - id: room-ae706306-67b2-4bf3-a5aa-b14c97cde769
    alias: Matiaksen huone
    hassId: area.matiaksen_huone
    tap_action:
      action: more-info 
      target:
          path: "room.yml"
    double_tap_action:
      action: call-service
      service: light.toggle
      target:
          entity_id: light.matiaksen_huone_2
    entities:
      - type: icon 
        icon: plug-2 
        entity_id: light.hue_lightstrip_plus_1
        position: 
            x: 700 
            y: 1260
            z: 150
      - type: icon 
        entity_id: light.hue_ambiance_candle_3
        tap_action:
          action: call-service
          service: light.toggle
          target:
            entity_id: light.hue_ambiance_candle_3
        position: 
          x: 520 
          y: 1140 
          z: 150 
      - type: temperatureDisplay
        font_size: 220 
        top_sensor_id: sensor.atc_efaf_temperature
        bottom_sensor_id: sensor.atc_efaf_humidity
        position:
          x: 700 
          y: 1195 
          z: 0
 
  - id: room-a8239ead-614a-4d1e-9c8c-686e5a12d0a9
    hassId: Makuuhone 
    tap_action:
      action: more-info 
      target:
        bottomSheetY: 0.85
        path: "room.yml"
    entities:
      - type: temperatureDisplay
        font_size: 220 
        top_sensor_id: sensor.atc_efaf_temperature
        bottom_sensor_id: sensor.atc_efaf_humidity
        position:
          x: 800 
             y: 750         z: 0
   
 
```

## Configuration options
List of all possible options


## Action

_Union of the following possible types:_

- [MoreInfoAction](#moreinfoaction)
- [CallServiceAction](#callserviceaction)
- [MoreInfoHass](#moreinfohass)

## Building

_Object containing the following properties:_

| Property                  | Description                              | Type                           |
| :------------------------ | :--------------------------------------- | :----------------------------- |
| **`title`** (\*)          |                                          | `string`                       |
| **`floorplan_name`** (\*) | Path where buildings floorplan is loaded | `string`                       |
| **`rooms`** (\*)          |                                          | _Array of [Room](#room) items_ |

_(\*) Required._

## CallServiceAction

_Object containing the following properties:_

| Property           | Type                                                                      |
| :----------------- | :------------------------------------------------------------------------ |
| **`action`** (\*)  | `'call-service'`                                                          |
| **`service`** (\*) | `string`                                                                  |
| **`target`** (\*)  | _Object with properties:_<ul><li>**`entity_id`** (\*): `string`</li></ul> |

_(\*) Required._

## EntityCard

_Object containing the following properties:_

| Property             | Type                     |
| :------------------- | :----------------------- |
| **`entity_id`** (\*) | `string`                 |
| **`size`** (\*)      | `'md' \| 'sm' \| 'wide'` |
| `tap_action`         | [Action](#action)        |
| `double_tap_action`  | [Action](#action)        |
| `hold_action`        | [Action](#action)        |

_(\*) Required._

## Entity

_Union of the following possible types:_

- [IconEntity](#iconentity)
- [TemperatureDisplayEntity](#temperaturedisplayentity)

## HomeConfig

_Object containing the following properties:_

| Property             | Type            |
| :------------------- | :-------------- |
| **`title`** (\*)     | `string`        |
| **`buildings`** (\*) | `Array<string>` |

_(\*) Required._

## IconEntity

_Object containing the following properties:_

| Property             | Type                  |
| :------------------- | :-------------------- |
| **`type`** (\*)      | `'icon'`              |
| **`entity_id`** (\*) | `string`              |
| **`icon`** (\*)      | `string`              |
| `tap_action`         | [Action](#action)     |
| `double_tap_action`  | [Action](#action)     |
| `hold_action`        | [Action](#action)     |
| `position`           | [Position](#position) |

_(\*) Required._

## MoreInfoAction

_Object containing the following properties:_

| Property          | Type                                                                                                                                                                                     |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`action`** (\*) | `'more-info'`                                                                                                                                                                            |
| **`target`** (\*) | _Object with properties:_<ul><li>**`path`** (\*): `string`</li></ul> _or_ _Object with properties:_<ul><li>**`cards`** (\*): `string`</li><li>**`bottomSheet`** (\*): `string`</li></ul> |

_(\*) Required._

## MoreInfoHass

_Object containing the following properties:_

| Property          | Type                                                                      |
| :---------------- | :------------------------------------------------------------------------ |
| **`action`** (\*) | `'hass-more-info'`                                                        |
| **`target`** (\*) | _Object with properties:_<ul><li>**`entity_id`** (\*): `string`</li></ul> |

_(\*) Required._

## Position

_Object containing the following properties:_

| Property     | Type     |
| :----------- | :------- |
| **`x`** (\*) | `number` |
| **`y`** (\*) | `number` |
| **`z`** (\*) | `number` |

_(\*) Required._

## RoomCard

_Object containing the following properties:_

| Property            | Description | Type                                                  |
| :------------------ | :---------- | :---------------------------------------------------- |
| **`type`** (\*)     |             | `'room'`                                              |
| **`title`** (\*)    | testi3ng    | `string` (_min length: 1_)                            |
| **`scenes`** (\*)   |             | _Array of at least 1 [Scene](#scene) items_           |
| **`entities`** (\*) |             | _Array of at least 1 [EntityCard](#entitycard) items_ |

_(\*) Required._

## Room

_Object containing the following properties:_

| Property            | Type                               |
| :------------------ | :--------------------------------- |
| **`id`** (\*)       | `string`                           |
| `alias`             | `string`                           |
| `tap_action`        | [Action](#action)                  |
| `double_tap_action` | [Action](#action)                  |
| `entities`          | _Array of [Entity](#entity) items_ |

_(\*) Required._

## Scene

_Object containing the following properties:_

| Property            | Type                       |
| :------------------ | :------------------------- |
| **`icon`** (\*)     | `string` (_min length: 1_) |
| **`title`** (\*)    | `string` (_min length: 1_) |
| `tap_action`        | [Action](#action)          |
| `double_tap_action` | [Action](#action)          |
| `hold_action`       | [Action](#action)          |

_(\*) Required._

## TemperatureDisplayEntity

_Object containing the following properties:_

| Property                    | Type                    |
| :-------------------------- | :---------------------- |
| **`type`** (\*)             | `'temperature_display'` |
| `font_size`                 | `number`                |
| **`top_sensor_id`** (\*)    | `string`                |
| **`bottom_sensor_id`** (\*) | `string`                |
| `position`                  | [Position](#position)   |
| `tap_action`                | [Action](#action)       |

_(\*) Required._


