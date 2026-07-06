"use client";
import { RootState } from "@/redux/store";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ShieldCheck,
  VideoIcon,
  UserCheck,
  Radio,
} from "lucide-react";
import Button from "../ui/Button";

function ZegoCall() {
  const { userData } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const {roomId} = useParams();

  const [joined, setJoined] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    if (joined) return;
    let localStream: MediaStream

    const initHardware = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

          setStream(localStream);
          if (previewRef.current) {
            previewRef.current.srcObject = localStream;
          }
      } catch (error) {
        console.error("Hardware access denied:", error);
          setPermissionError(
            "Camera or Microphone access was denied. Please check your system settings."
          );
      }
    };

    initHardware();
  }, [joined]);

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const startCall = async () => {
    if (!containerRef.current) return null;

    if (!userData) return null;
    if (!roomId) return null;
    const displayName =
      userData.role === "admin" ? "Admin" : `${userData.name}`;

    try {
      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret!,
        roomId.toString(),
        userData._id.toString(),
        displayName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });

      setJoined(true);
    } catch (error) {
      console.error("Failed to start Zego call:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-primary flex flex-col selection:bg-zinc-800 antialiased">

        <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/40 backdrop-blur-xl transition-colors duration-300">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-sm font-medium tracking-tight block">
                  Secure Identity Verification
                </span>
                <span className="text-[11px] text-primary/70 block uppercase tracking-widest">
                  Session Live
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium">
                  {userData?.name || "Loading..."}
                </span>
                <span className="text-[11px] text-primary/70 capitalize">
                  {userData?.role || "Verification Candidate"}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center overflow-hidden">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>

      <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"> 

        <div ref={containerRef} className={`absolute inset-0 ${joined ? "block" : "hidden"}`}/>

        {!joined && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center lg:py-6">
            <div className="lg:col-span-7 xl:col-span-8 w-full flex flex-col items-center">
              <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl bg-zinc-900 border border-zinc-800/80 shadow-2xl overflow-hidden group transition-all duration-500 hover:border-zinc-700/60">
                {isCameraOn && !permissionError ? (
                  <video
                    ref={previewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1] transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 hidden sm:block sm:flex sm:flex-col items-center justify-center bg-linear-to-b from-zinc-900 to-zinc-950 text-center p-6 transition-all duration-300">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-800/40 border border-zinc-700/30 flex items-center justify-center mb-4 backdrop-blur-md shadow-inner">
                      <VideoOff className="h-5 w-5 text-zinc-500" />
                    </div>
                    <p className="text-sm font-medium text-zinc-400">
                      Your camera is turned off
                    </p>
                  </div>
                )}

                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-zinc-950/60 backdrop-blur-md px-3 py-1.5 border border-white/5 text-[11px] font-medium tracking-wide">
                  <span
                    className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                      isCameraOn ? "bg-emerald-400" : "bg-zinc-500"
                    }`}
                  />
                  {isCameraOn ? "Camera Active" : "Feed Paused"}
                </div>

                {permissionError && (
                  <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-6 text-center z-10">
                    <p className="text-sm text-rose-400 max-w-md bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl">
                      {permissionError}
                    </p>
                  </div>
                )}

                <div className="absolute bottom-6 inset-x-0 flex justify-center items-center px-4 pointer-events-none">
                  <div className="flex items-center gap-4 bg-zinc-950/70 backdrop-blur-xl px-5 py-3 rounded-full border border-white/10 shadow-xl pointer-events-auto transition-all duration-300 hover:bg-zinc-950/90">
                    <button
                      type="button"
                      onClick={toggleCamera}
                      className={`sm:p-3 rounded-full flex items-center justify-center transition-all duration-300 relative group/btn cursor-pointer ${
                        isCameraOn
                          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                          : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                      }`}
                      title={isCameraOn ? "Turn off camera" : "Turn on camera"}
                    >
                      {isCameraOn ? (
                        <Video className="h-5 w-5" />
                      ) : (
                        <VideoOff className="h-5 w-5" />
                      )}
                      <span className="absolute -top-10 scale-0 transition-all rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] text-zinc-400 group-hover/btn:scale-100">
                        {isCameraOn ? "Disable Video" : "Enable Video"}
                      </span>
                    </button>

                    <div className="h-5 w-px bg-zinc-800" />

                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`sm:p-3 rounded-full flex items-center justify-center transition-all duration-300 relative group/btn cursor-pointer ${
                        isMicOn
                          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                          : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                      }`}
                      title={isMicOn ? "Mute microphone" : "Unmute microphone"}
                    >
                      {isMicOn ? (
                        <Mic className="h-5 w-5" />
                      ) : (
                        <MicOff className="h-5 w-5" />
                      )}
                      <span className="absolute -top-10 scale-0 transition-all rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] text-zinc-400 group-hover/btn:scale-100">
                        {isMicOn ? "Mute Audio" : "Unmute Audio"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 w-full flex flex-col space-y-6">
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl sm:rounded-3xl p-6 backdrop-blur-md shadow-lg space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 tracking-wider bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
                    <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />{" "}
                    ROOM READY
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
                    Ready to begin verification?
                  </h1>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Ensure you are in a quiet, well-lit environment. Have your
                    physical identity documents nearby before clicking join.
                  </p>
                </div>

                <hr className="border-zinc-800/60" />

                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-zinc-500  font-bold">
                    Hardware Check
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-900/60 border border-zinc-800/40 p-3 rounded-xl flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isCameraOn
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                            : "bg-zinc-600"
                        }`}
                      />
                      <span className="text-xs font-medium text-zinc-300">
                        Camera
                      </span>
                    </div>
                    <div className="bg-zinc-900/60 border border-zinc-800/40 p-3 rounded-xl flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isMicOn
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                            : "bg-zinc-600"
                        }`}
                      />
                      <span className="text-xs font-medium text-zinc-300">
                        Microphone
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  leftIcon={<VideoIcon className="h-4 w-4 transition-transform group-hover:scale-110" />}
                  onClick={startCall}
                  className="w-full bg-background hover:bg-white transition-all duration-300 text-black"
                >
                  Join Call
                </Button>
              </div>

              <p className="text-center text-[11px] text-primary/50 px-4">
                This encrypted portal is protected using AES 256-bit connection
                standards. Your verification feeds are handled with strict
                processing guidelines.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ZegoCall;
