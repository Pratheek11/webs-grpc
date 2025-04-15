package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
	"websgrpcgo/structs"

	"github.com/gorilla/websocket"
)

var (
	websocketUpgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

func Status(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"UP"}`))
}

func HandleNews(w http.ResponseWriter, r *http.Request) {
	conn, err := websocketUpgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Failed to upgrade connection", http.StatusInternalServerError)
		return
	}
	defer conn.Close()
	fmt.Printf("Client upgraded")

	t := time.NewTicker(60 * time.Second)
	defer t.Stop()

	for {
		select {
		case <-t.C:
			data, err := readFromJsonFile()
			if err == nil {
				err = conn.WriteMessage(websocket.TextMessage, data)
				if err != nil {
					return
				}
			}
		}
	}
}

func readFromJsonFile() ([]byte, error) {
	file, err := os.Open("data/news.json")
	if err != nil {
		fmt.Printf("Error opening file: %v\n", err)
		return nil, err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	var data []structs.News
	err = decoder.Decode(&data)
	if err != nil {
		fmt.Printf("Error decoding JSON: %v\n", err)
		return nil, err
	}

	jsonData, err := json.Marshal(data)

	if err != nil {
		fmt.Printf("Error opening file: %v\n", err)
		return nil, err
	}
	return jsonData, nil
}
