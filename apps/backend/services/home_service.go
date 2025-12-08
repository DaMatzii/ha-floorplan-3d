package services

import (
	"bytes"
	"errors"

	"fmt"
	"github.com/clbanning/mxj/v2"
)

func GetRooms(fileBuf *bytes.Buffer) ([]Room, error) {
	mv, err := mxj.NewMapXml(fileBuf.Bytes())
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal XML: %w", err)
	}

	var roomList []Room

	homeAny, ok := mv["home"]
	if !ok {
		return nil, errors.New("XML is missing the 'home' element")
	}

	home, ok := homeAny.(map[string]any)
	if !ok {
		return nil, errors.New("'home' element is not a map")
	}

	roomsAny, ok := home["room"]
	if ok {
		roomItems, ok := roomsAny.([]any)
		if !ok {
			if singleRoom, isMap := roomsAny.(map[string]any); isMap {
				roomItems = []any{singleRoom}
			} else {
				return nil, errors.New("'room' element is not a slice or single map")
			}
		}

		for _, roomItem := range roomItems {
			r, ok := roomItem.(map[string]any)
			if !ok {
				fmt.Printf("Warning: room item is not a map: %v\n", roomItem)
				continue
			}

			id, idOK := r["-id"].(string)
			name, nameOK := r["-name"].(string)

			if idOK {
				if !nameOK {
					name = "unnamed"
				}

				roomList = append(roomList, Room{Id: id, Name: name})
			} else {
				fmt.Printf("Warning: Room is missing 'id'. Invalid file? %v\n", r)
			}
		}
	}
	return roomList, nil
}
