import "./App.css";
import React, { useMemo, useState } from "react"; 
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./api/index";
import ReactPlayer from "react-player";

function ParticipantView({ participantId }) {
  const { webcamStream, webcamOn, displayName } = useParticipant(participantId);
  
  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  return (
    <div style={{ border: "1px solid grey", margin: 10, padding: 10 }}>
      <p>Participant: {displayName}</p>
      {webcamOn && (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          height={"200px"}
          width={"300px"}
        />
      )}
    </div>
  );
}

function Controls({ onSwitch }) {
  const { leave, toggleWebcam, toggleMic, requestMediaRelay } = useMeeting();

  const handleMediaRelay = () => {
    const destinationId = prompt("Enter Destination Room ID for Relay:");
    if (destinationId) {
      requestMediaRelay({
        destinationMeetingId: destinationId,
        kinds: ["video", "audio"],
      });
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <button onClick={() => toggleMic()}>Mic</button>
      <button onClick={() => toggleWebcam()}>Webcam</button>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={onSwitch} style={{ backgroundColor: "#007bff", color: "white" }}>
        Switch to Room B
      </button>
      <button onClick={handleMediaRelay} style={{ backgroundColor: "#28a745", color: "white" }}>
        Start Media Relay
      </button>
    </div>
  );
}

function MeetingView({ meetingId, onMeetingLeave, onSwitchRoom }) {
  const { participants, join } = useMeeting({
    onMeetingJoined: () => console.log("Joined Room:", meetingId),
    onMeetingLeft: onMeetingLeave,
  });

  React.useEffect(() => {
    join();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h3>Meeting ID: {meetingId}</h3>
      <Controls onSwitch={onSwitchRoom} />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {[...participants.keys()].map((participantId) => (
          <ParticipantView key={participantId} participantId={participantId} />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [meetingId, setMeetingId] = useState(null);
  const [roomBId, setRoomBId] = useState(null);

  const startFlow = async () => {
    const mIdA = await createMeeting({ token: authToken });
    const mIdB = await createMeeting({ token: authToken });
    setMeetingId(mIdA);
    setRoomBId(mIdB);
  };

  return (
    <div className="App">
      {!meetingId ? (
        <button onClick={startFlow}>Initialize Rooms & Join Room A</button>
      ) : (
        <MeetingProvider
          config={{ meetingId, micEnabled: true, webcamEnabled: true, name: "Gnana" }}
          token={authToken}
        >
          <MeetingView 
            meetingId={meetingId} 
            onMeetingLeave={() => setMeetingId(null)} 
            onSwitchRoom={() => setMeetingId(roomBId)}
          />
        </MeetingProvider>
      )}
    </div>
  );
}

export default App;