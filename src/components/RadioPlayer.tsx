import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Radio, Volume2, Sparkles, RefreshCw, VolumeX, Plus, Music, Mic, Trash2, UploadCloud, Globe, FileAudio, Disc, Lock, Unlock, ShieldAlert } from "lucide-react";
import { Language, TRANSLATIONS } from "../types";

// Let's create actual synthesized sound or beautiful HTML5 Web Audio loops to bring actual sound!
interface RadioStation {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  descAr: string;
  descFr: string;
  descEn: string;
  frequency: string;
  audioUrl?: string; // live stream URL if available
  synthType: "nature" | "wind" | "classic" | "tuning" | "live" | "custom_playlist";
}

const STATION_LIST: RadioStation[] = [
  {
    id: "st-tebournok-free",
    nameAr: "إذاعة صوت طبرنق الحرة 📣",
    nameFr: "Voix de Tebournok Libre",
    nameEn: "Voice of Tebournok Free Radio",
    descAr: "منبر القرية الحر: أضف أغانيك وشارك تقارير صوتية وسجل رسالتك مباشرة لإنقاذ بلدتنا. (خاص بالأدمن)",
    descFr: "Le média libre citoyen d'Ain Tebournok. (Mode Admin requis pour ajouter)",
    descEn: "Tebournok's community station: contribute songs, play folk tracks, or record your voice live. (Admin Only)",
    frequency: "90.0 MHz",
    synthType: "custom_playlist"
  },
  {
    id: "st-mosaique",
    nameAr: "إذاعة موزاييك أف أم 📻",
    nameFr: "Mosaïque FM Live",
    nameEn: "Mosaique FM Tunisia",
    descAr: "البث المباشر لأكثر الإذاعات التونسية متابعة وأبرز الأخبار الوطنية والترفيهية.",
    descFr: "La radio leader en Tunisie, l'actualité en continu et le meilleur de la musique tunisienne.",
    descEn: "Tunisia's leading private radio station with premium news, hits and cultural debate.",
    frequency: "94.5 MHz",
    audioUrl: "https://shoutcast.mosaiquefm.net/mosaique",
    synthType: "live"
  },
  {
    id: "st-nationale",
    nameAr: "الإذاعة الوطنية التونسية 🇹🇳",
    nameFr: "Radio Nationale Tunisienne",
    nameEn: "Tunisian National Radio",
    descAr: "بث عريق ومباشر من أعرق المحطات الإذاعية العمومية في تونس بنكهة الزمن الجميل.",
    descFr: "La doyenne des ondes nationales tunisiennes, la voix culturelle officielle de l'État.",
    descEn: "The historical official public broadcaster of Tunisia, rich with golden tape archives.",
    frequency: "88.0 MHz",
    audioUrl: "https://rtatmp.rtci.tn/national",
    synthType: "live"
  },
  {
    id: "st-jeunes",
    nameAr: "إذاعة الشباب التونسية ⚡",
    nameFr: "Radio Jeunes Tunisie",
    nameEn: "Tunisia Youth Radio",
    descAr: "البث المباشر المخصص للشباب والابتكار والإبداع والموسيقى العصرية على مدار الساعة.",
    descFr: "La station publique tunisienne dynamique dédiée à l'art, la culture et l'actualité jeune.",
    descEn: "Tunisian public stream dedicated to young generations, new startups, and hot modern tunes.",
    frequency: "91.5 MHz",
    audioUrl: "https://rtatmp.rtci.tn/rjeunes",
    synthType: "live"
  },
  {
    id: "st-zitouna",
    nameAr: "إذاعة الزيتونة للقرآن الكريم 🕋",
    nameFr: "Radio Zitouna FM",
    nameEn: "Zitouna FM",
    descAr: "إذاعة برامج دينية وتلاوات خاشعة على مدار الساعة من تونس.",
    descFr: "La radio tunisienne du Saint Coran, de la spiritualité et des valeurs.",
    descEn: "Tunisian spiritual and Holy Quran station streaming live recitations around the clock.",
    frequency: "99.1 MHz",
    audioUrl: "https://stream.zeno.fm/4mep9yqq7u8uv",
    synthType: "live"
  },
  {
    id: "st-sabra",
    nameAr: "إذاعة صبرة أف أم 🎙️",
    nameFr: "Radio Sabra FM",
    nameEn: "Sabra FM",
    descAr: "صوت الوسط التونسي من عاصمة الأغالبة القيروان مباشرة.",
    descFr: "La principale radio de Kairouan et de la région du Centre.",
    descEn: "Vibrant broadcasting station live from Kairouan, central Tunisia.",
    frequency: "98.8 MHz",
    audioUrl: "https://radiosabra.ice.infomaniak.ch/radiosabra-64.mp3",
    synthType: "live"
  },
  {
    id: "st-ifm",
    nameAr: "إذاعة إي أف أم (IFM) 🎶",
    nameFr: "Radio IFM",
    nameEn: "IFM Tunisia",
    descAr: "أول إذاعة مخصصة للضحك والموسيقى والترفيه التفاعلي في تونس.",
    descFr: "La première radio du rire et de la musique moderne en Tunisie.",
    descEn: "The premier private comedy-centric and music hits station in Tunis.",
    frequency: "100.6 MHz",
    audioUrl: "https://live.ifm.tn/radio/8000/ifm.mp3",
    synthType: "live"
  },
  {
    id: "st-express",
    nameAr: "إذاعة إكسبريس أف أم 📈",
    nameFr: "Express FM",
    nameEn: "Express FM",
    descAr: "الإذاعة الاقتصادية الأولى في تونس تغطية للأعمال والريادة والفرص.",
    descFr: "La première radio économique d'informations financières en Tunisie.",
    descEn: "Tunisia's major business-focused private live broadcasting network.",
    frequency: "103.6 MHz",
    audioUrl: "https://expressfm.ice.infomaniak.ch/expressfm-64.mp3",
    synthType: "live"
  },
  {
    id: "st-diwan",
    nameAr: "إذاعة ديوان أف أم 📢",
    nameFr: "Diwan FM",
    nameEn: "Diwan FM",
    descAr: "النبض الإخباري والرياضي التفاعلي المنطلق من صفاقس لعموم تونس.",
    descFr: "La voix de Sfax et de toute la Tunisie moderne.",
    descEn: "The leading regional broadcaster of Sfax with comprehensive sports news.",
    frequency: "91.2 MHz",
    audioUrl: "https://stream.diwanfm.net/radio/8000/diwanfm.mp3",
    synthType: "live"
  },
  {
    id: "st-panorama",
    nameAr: "إذاعة بانوراما 📻",
    nameFr: "Radio Panorama Tunis",
    nameEn: "Radio Panorama",
    descAr: "محطة منوعة هادئة تابعة للإذاعة التونسية تركز على الثقافة والفنون واللقاءات.",
    descFr: "Chaîne culturelle et musicale de l'Établissement de la Radio Tunisienne.",
    descEn: "Vibrant community and cultural state-owned FM radio program.",
    frequency: "92.5 MHz",
    audioUrl: "https://rtatmp.rtci.tn/panorama",
    synthType: "live"
  }
];

interface RadioPlayerProps {
  lang: Language;
  isAdmin: boolean;
}

export default function RadioPlayer({ lang, isAdmin }: RadioPlayerProps) {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [frequencyDial, setFrequencyDial] = useState(90.0);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(Array(20).fill(4));
  
  // Custom Playlist State for Voice of Tebournok
  const defaultTracks: { id: string; titleAr: string; titleEn: string; artistAr: string; artistEn: string; url: string; duration: string; isPreset?: boolean }[] = [
    {
      id: "track-1",
      titleAr: "سماعي الريف - تقاسيم قصبة حية 🌾",
      titleEn: "Sound of Rural Tunisia - Live Gasba Flute",
      artistAr: "فرقة عين طبرنق التراثية",
      artistEn: "Ain Tebournok Folk Musicians",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: "06:12",
      isPreset: true
    },
    {
      id: "track-2",
      titleAr: "نداء عاجل: أهالي القرية يطالبون بفتح البريد والمدرسة المتداعية 📣",
      titleEn: "Urgent Plea: Villagers demand Post Office & School Action",
      artistAr: "المواطن ومرشدنا المحلي العم مفتاح وبقية أهالي القرية الصابرين",
      artistEn: "Uncle Meftah & Co. (Local Community Voices)",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      duration: "05:02",
      isPreset: true
    },
    {
      id: "track-3",
      titleAr: "أغنية فلكلورية - الهواوي يا أم الهواشي 🎶",
      titleEn: "Folkloric Song - Al-Hawawi Tunisian Heritage",
      artistAr: "تراث بدوي عتيق لبلاد قرنبالية والوطن القبلي",
      artistEn: "Bedouin Vintage Heritage of Grombalia & Nabeul",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      duration: "05:38",
      isPreset: true
    }
  ];

  const [playlist, setPlaylist] = useState(() => {
    try {
      const saved = localStorage.getItem("tebournok_custom_playlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Reconnect preset stream URLs just in case
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Storage read failed", e);
    }
    return defaultTracks;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Form states to add new audio
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const visualizerInterval = useRef<any>(null);
  const liveAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize live HTML5 audio controller
  useEffect(() => {
    liveAudioRef.current = new Audio();
    return () => {
      if (liveAudioRef.current) {
        liveAudioRef.current.pause();
        liveAudioRef.current.src = "";
      }
    };
  }, []);

  // Handle stream ended -> auto-advance in playlist
  useEffect(() => {
    const audio = liveAudioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const activeStation = STATION_LIST[currentStationIndex];
      if (activeStation.synthType === "custom_playlist" && playlist.length > 0) {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentStationIndex, playlist]);

  // Main playback manager
  useEffect(() => {
    const station = STATION_LIST[currentStationIndex];
    
    // Stop procedural synth
    stopProceduralAudioNodes();
    
    // Pause internet audio
    if (liveAudioRef.current) {
      liveAudioRef.current.pause();
    }

    if (isPlaying) {
      if (station.synthType === "live") {
        if (liveAudioRef.current && station.audioUrl) {
          liveAudioRef.current.src = station.audioUrl;
          liveAudioRef.current.volume = isMuted ? 0 : volume;
          const playPromise = liveAudioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn("Live radio stream failed to load/play. This might be due to a strict browser security frame or CORS:", err);
            });
          }
        }
      } else if (station.synthType === "custom_playlist") {
        if (liveAudioRef.current && playlist.length > 0) {
          const track = playlist[currentTrackIndex % playlist.length];
          if (track) {
            liveAudioRef.current.src = track.url;
            liveAudioRef.current.volume = isMuted ? 0 : volume;
            const playPromise = liveAudioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.warn("Custom playlist track failed:", err);
              });
            }
          }
        }
      } else {
        // Procedural Web Audio context synth
        startProceduralAudio();
      }

      // Visualizer wave generator loops
      if (!visualizerInterval.current) {
        visualizerInterval.current = setInterval(() => {
          setVisualizerHeights(
            Array(20)
              .fill(0)
              .map(() => 4 + Math.floor(Math.random() * 40))
          );
        }, 110);
      }
    } else {
      clearInterval(visualizerInterval.current);
      visualizerInterval.current = null;
      setVisualizerHeights(Array(20).fill(4));
    }

    return () => {
      // transient cleanups
    };
  }, [isPlaying, currentStationIndex, currentTrackIndex, playlist, isMuted, volume]);

  // Keep volume nodes in sync
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume,
        audioContextRef.current.currentTime
      );
    }
    if (liveAudioRef.current) {
      liveAudioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Procedural Synth Algorithms
  const startProceduralAudio = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.connect(ctx.destination);
      }

      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      stopProceduralAudioNodes();

      const station = STATION_LIST[currentStationIndex];

      if (station.synthType === "nature") {
        const intervalId = setInterval(() => {
          if (!isPlaying || isMuted) return;
          createBirdChirp(ctx);
        }, 1200);
        createWindHum(ctx, 140, 0.05);
        (window as any)._birdInterval = intervalId;
      } else if (station.synthType === "wind") {
        createWaterRipple(ctx);
      } else if (station.synthType === "classic") {
        createEasternFluteLullaby(ctx);
      }
    } catch (e) {
      console.warn("Web Audio API warning:", e);
    }
  };

  const stopProceduralAudioNodes = () => {
    oscillatorsRef.current.forEach((o) => {
      try { o.osc.stop(); } catch (e) {}
    });
    oscillatorsRef.current = [];

    if ((window as any)._birdInterval) {
      clearInterval((window as any)._birdInterval);
      (window as any)._birdInterval = null;
    }
    if ((window as any)._waterInterval) {
      clearInterval((window as any)._waterInterval);
      (window as any)._waterInterval = null;
    }
    if ((window as any)._fluteInterval) {
      clearInterval((window as any)._fluteInterval);
      (window as any)._fluteInterval = null;
    }
  };

  const createWindHum = (ctx: AudioContext, freq: number, gainLevel: number) => {
    if (!gainNodeRef.current) return;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const oscGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    lfoGain.gain.setValueAtTime(15, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    oscGain.gain.setValueAtTime(gainLevel * volume, ctx.currentTime);
    
    osc.connect(oscGain);
    oscGain.connect(gainNodeRef.current);

    lfo.start();
    osc.start();

    oscillatorsRef.current.push({ osc, gain: oscGain });
  };

  const createBirdChirp = (ctx: AudioContext) => {
    if (!gainNodeRef.current || isMuted) return;
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = "sine";
    const startTime = ctx.currentTime;
    const baseFreq = 800 + Math.random() * 600;
    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, startTime + 0.15);
    
    oscGain.gain.setValueAtTime(0, startTime);
    oscGain.gain.linearRampToValueAtTime(0.08 * volume, startTime + 0.02);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

    osc.connect(oscGain);
    oscGain.connect(gainNodeRef.current);

    osc.start(startTime);
    osc.stop(startTime + 0.16);
  };

  const createWaterRipple = (ctx: AudioContext) => {
    createWindHum(ctx, 110, 0.04);
    const intervalId = setInterval(() => {
      if (!isPlaying || isMuted || !gainNodeRef.current) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = "triangle";
      const bubbleFreq = 250 + Math.random() * 300;
      osc.frequency.setValueAtTime(bubbleFreq, now);
      osc.frequency.exponentialRampToValueAtTime(bubbleFreq * 0.4, now + 0.3);

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.06 * volume, now + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(oscGain);
      oscGain.connect(gainNodeRef.current);
      osc.start(now);
      osc.stop(now + 0.31);
    }, 280);

    (window as any)._waterInterval = intervalId;
  };

  const createEasternFluteLullaby = (ctx: AudioContext) => {
    const pentatonicNotes = [293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
    createWindHum(ctx, 150, 0.02);

    const playNextNote = () => {
      if (!isPlaying || isMuted || !gainNodeRef.current) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const vibrato = ctx.createOscillator();
      const vibGain = ctx.createGain();

      osc.type = "triangle";
      const chooseNote = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
      osc.frequency.setValueAtTime(chooseNote, now);
      osc.frequency.linearRampToValueAtTime(chooseNote + (Math.random() > 0.5 ? 4 : -4), now + 1.8);

      vibrato.frequency.setValueAtTime(6, now);
      vibGain.gain.setValueAtTime(3, now);
      vibrato.connect(vibGain);
      vibGain.connect(osc.frequency);

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.08 * volume, now + 0.4);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(oscGain);
      oscGain.connect(gainNodeRef.current);

      vibrato.start(now);
      osc.start(now);
      vibrato.stop(now + 2.3);
      osc.stop(now + 2.3);
    };

    playNextNote();
    const intervalId = setInterval(playNextNote, 2400);
    (window as any)._fluteInterval = intervalId;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Station Change handler
  const handleStationChange = (index: number) => {
    setCurrentStationIndex(index);
    const station = STATION_LIST[index];
    const freqVal = parseFloat(station.frequency);
    setFrequencyDial(freqVal);
    
    // scratch sound tuning effect
    if (isPlaying && audioContextRef.current) {
      try {
        const now = audioContextRef.current.currentTime;
        const staticOsc = audioContextRef.current.createOscillator();
        const staticGain = audioContextRef.current.createGain();
        staticOsc.type = "sawtooth";
        staticOsc.frequency.setValueAtTime(120, now);
        staticGain.gain.setValueAtTime(0.02 * volume, now);
        staticGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        staticOsc.connect(staticGain);
        if (gainNodeRef.current) staticGain.connect(gainNodeRef.current);
        staticOsc.start(now);
        staticOsc.stop(now + 0.26);
      } catch (e) {}
    }
  };

  // Upload custom file handler
  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const fileUrl = reader.result as string;
      const newTrack = {
        id: `file-${Date.now()}`,
        titleAr: file.name.replace(/\.[^/.]+$/, "") + " 📁",
        titleEn: file.name.replace(/\.[^/.]+$/, "") + " 📁",
        artistAr: lang === "ar" ? "تسجيل محلي مضاف" : "Custom Added File",
        artistEn: "Custom Added File",
        url: fileUrl,
        duration: "جهازك"
      };

      const updated = [newTrack, ...playlist];
      setPlaylist(updated);
      setCurrentTrackIndex(0);
      setIsPlaying(true);
      try {
        localStorage.setItem("tebournok_custom_playlist", JSON.stringify(updated.filter(t => !t.url.startsWith("blob:"))));
      } catch (err) {
        console.warn("Storage full", err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // reset
  };

  // Start live microphone note recording
  const handleStartMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const docBlob = new Blob(chunks, { type: "audio/wav" });
        const voiceUrl = URL.createObjectURL(docBlob);
        
        const voiceTrack = {
          id: `mic-${Date.now()}`,
          titleAr: `تسجيل إذاعي مجتمعي مباشر #${playlist.length + 1} 🎙️`,
          titleEn: `Live Citizens Audio Podcast #${playlist.length + 1} 🎙️`,
          artistAr: lang === "ar" ? "تسجيل صوتي للمواطن من طبرنق" : "Citizen recorded comment",
          artistEn: "Citizen recorded comment",
          url: voiceUrl,
          duration: "مباشر"
        };

        const updated = [voiceTrack, ...playlist];
        setPlaylist(updated);
        setCurrentTrackIndex(0);
        setIsPlaying(true);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert(lang === "ar" ? "الرجاء توفير إذن الميكروفون للتسجيل الإذاعي." : "Microphone permission is required to broadcast your voice note.");
    }
  };

  const handleStopMic = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    }
  };

  // Submit dynamic Web Link
  const handleSubmitWebLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const addedTrack = {
      id: `link-${Date.now()}`,
      titleAr: newTitle.trim() + " 🌐",
      titleEn: newTitle.trim() + " 🌐",
      artistAr: newArtist.trim() || (lang === "ar" ? "رابط خارجي" : "Web Stream link"),
      artistEn: newArtist.trim() || "Web Stream link",
      url: newUrl.trim(),
      duration: "إنترنت"
    };

    const updated = [addedTrack, ...playlist];
    setPlaylist(updated);
    setCurrentTrackIndex(0);
    setIsPlaying(true);

    // Reset fields
    setNewTitle("");
    setNewArtist("");
    setNewUrl("");
    setShowAddForm(false);

    // Save persistent non-expired links
    try {
      localStorage.setItem("tebournok_custom_playlist", JSON.stringify(updated.filter(t => !t.url.startsWith("blob:"))));
    } catch (e) {}
  };

  // Remove track from list
  const handleRemoveTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = playlist.filter((t) => t.id !== trackId);
    setPlaylist(updated);
    if (updated.length === 0) {
      setPlaylist(defaultTracks);
      setCurrentTrackIndex(0);
    } else {
      setCurrentTrackIndex(0);
    }
    // Update local storage
    try {
      localStorage.setItem("tebournok_custom_playlist", JSON.stringify(updated.filter(t => !t.url.startsWith("blob:"))));
    } catch (e) {}
  };

  const t = TRANSLATIONS[lang];
  const activeStation = STATION_LIST[currentStationIndex];

  return (
    <div id="radio-component" className="bg-stone-900 border-2 border-stone-800 text-stone-100 rounded-3xl p-6 shadow-xl relative overflow-hidden select-none max-w-xl mx-auto border-t-amber-500/40">
      
      {/* Wooden Frame subtle border effect */}
      <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-emerald-950 to-stone-900 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-l from-emerald-950 to-stone-900 pointer-events-none" />

      {/* Glossy ambient gold header lamp */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-amber-400/40 blur-sm rounded-full" />

      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-900/40">
          <span className={`inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ${isPlaying ? "animate-pulse" : ""}`}></span>
          {activeStation.synthType === "live" ? (lang === "ar" ? "بث مباشر إنترنت 🌐" : "Live Web Stream 🌐") : t.radioStatusOnline}
        </span>
        <div className="text-right">
          <h3 className="text-sm font-black font-sans text-amber-100/90 tracking-wide flex items-center gap-2 justify-end">
            <span>{t.radioTitle}</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </h3>
          <p className="text-[10px] text-stone-400 font-medium mt-1 leading-normal">
            {t.radioSubtitle}
          </p>
        </div>
      </div>

      {/* Main retro dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Needle tuning frequency scale simulator */}
        <div className="md:col-span-8 bg-stone-950/90 rounded-2xl p-4 border border-stone-800/80 relative">
          <div className="text-[9px] font-semibold text-stone-500 uppercase tracking-wider flex justify-between px-2 mb-2">
            <span>88 MHz</span>
            <span>90 MHz</span>
            <span>94 MHz</span>
            <span>98 MHz</span>
            <span>108 MHz</span>
          </div>

          {/* Scale line and needle */}
          <div className="h-6 bg-stone-900 rounded-lg relative overflow-hidden flex items-center border border-stone-800">
            {/* Symmetrical markers */}
            <div className="absolute inset-x-0 h-2 flex justify-between px-4 text-stone-600 font-mono text-[8px] pointer-events-none">
              <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
            </div>

            {/* Glowing amber needle pin */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-lg shadow-amber-400 transition-all duration-700 ease-out z-10"
              style={{
                left: `${((frequencyDial - 88) / 20) * 100}%`
              }}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-500 rounded-full animate-ping opacity-30" />
            </div>
            
            {/* Interactive dial glow */}
            <div 
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500/5 to-amber-500/10 pointer-events-none" 
              style={{ width: `${((frequencyDial - 88) / 20) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-900">
            <span className="text-xs font-mono text-emerald-400 font-black bg-stone-900 px-2 py-0.5 rounded border border-stone-800 animate-pulse">
              {activeStation.frequency}
            </span>
            <span className="text-[11px] font-bold text-stone-200">
              {lang === "ar" ? activeStation.nameAr : lang === "fr" ? activeStation.nameFr : activeStation.nameEn}
            </span>
          </div>
        </div>

        {/* Vintage big knob dials */}
        <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3">
          {/* Main big Play / Stop Switch */}
          <button
            id={`radio-play-toggle`}
            onClick={togglePlay}
            className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-400 border-amber-950 text-stone-950 scale-105 shadow-lg shadow-amber-500/20"
                : "bg-stone-800 hover:bg-stone-700 border-stone-950 text-stone-400"
            }`}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-stone-950" /> : <Play className="w-6 h-6 fill-stone-400 ml-0.5" />}
          </button>
          
          <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest text-center">
            {isPlaying ? t.radioPauseBtn : t.radioPlayBtn}
          </span>
        </div>

      </div>

      {/* Visualizer audio spectrum bars */}
      <div className="mt-5 bg-stone-950/60 rounded-xl p-3 border border-stone-800/60 flex items-center gap-1.5 h-14 justify-center">
        {visualizerHeights.map((h, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-100 ${
              isPlaying ? "bg-gradient-to-t from-emerald-700 to-amber-400" : "bg-stone-800"
            }`}
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* SPECIAL INTERACTIVE PANEL: Tebournok Free Broadcast Station */}
      {activeStation.id === "st-tebournok-free" && (
        <div className="mt-5 p-4 rounded-2xl bg-amber-950/20 border-2 border-amber-500/20 shadow-inner text-right animate-fade-in">
          
          {/* Admin Toggle Row */}
          <div className="mb-4 bg-stone-900/80 p-3 rounded-xl border border-stone-800 flex flex-col xs:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-right">
              <span className={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-[11px] font-black tracking-wide text-stone-100">
                {isAdmin 
                  ? (lang === "ar" ? "🔑 لوحة تحكم الإدارة الموحدة (مفعلة)" : "🔑 Unified Administration Control Unlocked") 
                  : (lang === "ar" ? "🔒 وضع استماع الزوار فقط (إضافة وتسجيل مغلق)" : "🔒 Guest Listener Mode (Add/Record Locked)")
                }
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("admin-console-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-2.5 py-1 text-[10px] bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg font-black cursor-pointer transition-all flex items-center gap-1"
                >
                  <Unlock className="w-3 h-3" />
                  <span>{lang === "ar" ? "تسجيل الدخول باللوحة الموحدة 🔑" : "Login Central Console 🔑"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Admin Tools Panel */}
          {isAdmin ? (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl mb-3 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] bg-red-950/60 text-red-400 border border-red-900 rounded-full font-bold mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    {lang === "ar" ? "استوديو البث الشعبي (مفعل)" : "Peoples Live Studio (Unlocked)"}
                  </span>
                  <h4 className="text-xs font-black text-amber-400">
                    {lang === "ar" ? "أدوات نشر محتوى الإذاعة 📻" : "Broadcast Queue & Contributions"}
                  </h4>
                </div>
                
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  {/* Record Mic */}
                  <button
                    type="button"
                    onClick={isRecording ? handleStopMic : handleStartMic}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      isRecording 
                        ? "bg-red-600 hover:bg-red-500 text-white animate-pulse" 
                        : "bg-emerald-950/80 hover:bg-emerald-800/80 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isRecording ? (lang === "ar" ? "إيقاف التسجيل 🔴" : "Stop Mic") : (lang === "ar" ? "سجل صوتك 🎙️" : "Record Voice")}</span>
                  </button>

                  {/* Upload File button */}
                  <label className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-400 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "أدرج أغنية 📂" : "Add Song File"}</span>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={handleLocalUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Quick toggle pastable Web Link Form button */}
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-stone-400 leading-tight">
                  {lang === "ar" ? "أضف روابط صوتية مباشرة وأغاني فلكلورية:" : "Choose from files, record directly, or stream web link:"}
                </p>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-[10px] font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 px-2 py-0.5 rounded border border-amber-900/40 bg-amber-950/30"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showAddForm ? (lang === "ar" ? "إغلاق" : "Close") : (lang === "ar" ? "إضافة رابط ويب 🔗" : "Add Web link")}</span>
                </button>
              </div>

              {/* Web link pastable Form */}
              {showAddForm && (
                <form onSubmit={handleSubmitWebLink} className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="block text-stone-400 mb-1">{lang === "ar" ? "عنوان المقطع / الأغنية" : "Track Title"}</label>
                      <input
                        type="text"
                        required
                        placeholder={lang === "ar" ? "مثال: مألوف طبرنق القديم" : "e.g., Old Tebournok Malouf"}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1 text-stone-100 outline-none focus:border-amber-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">{lang === "ar" ? "اسم المؤدي" : "Artist / Narrator"}</label>
                      <input
                        type="text"
                        placeholder={lang === "ar" ? "مثال: فرقة الفن الشعبي" : "e.g., Traditional Ensemble"}
                        value={newArtist}
                        onChange={(e) => setNewArtist(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1 text-stone-100 outline-none focus:border-amber-500 text-right"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">{lang === "ar" ? "رابط ملف الصوت المباشر (URL)" : "Direct Web Audio URL"}</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/audio.mp3"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1 text-[10px] text-stone-100 outline-none focus:border-amber-500 font-mono text-left"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded text-xs font-bold transition-all cursor-pointer"
                  >
                    {lang === "ar" ? "بث المقطع في الراديو الآن 📡" : "Stream This On The Radio 📡"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="mb-3 p-3 bg-stone-950/40 rounded-xl border border-stone-800 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-right">
                <h5 className="text-[11px] font-black text-stone-250">
                  {lang === "ar" ? "المحتوى متاح فقط للاستماع 🎧" : "Listener Mode Only 🎧"}
                </h5>
                <p className="text-[9px] text-stone-400 leading-normal">
                  {lang === "ar" 
                    ? "إضافة الأغاني وتسجيلات البث مخصصة فقط لمشرفي الموقع (الأدمين). يرجى تسجيل الدخول من خلال لوحة التحكم الأمنية المشتركة في أسفل الصفحة لفتح مميزات التعديل والبث بالكامل." 
                    : "Adding custom songs or broadcast audio recordings is only enabled for admins. Sign in through the consolidated access terminal at the bottom of the page to unlock interactive controls."}
                </p>
              </div>
            </div>
          )}

          {/* Real Tracks List */}
          <div className="max-h-44 overflow-y-auto space-y-1 pr-1 border border-stone-900 rounded-lg p-1.5 bg-stone-950/70">
            {playlist.map((track, trackIdx) => {
              const isActiveTrack = currentTrackIndex % playlist.length === trackIdx;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(trackIdx);
                    setIsPlaying(true);
                  }}
                  className={`group p-2 rounded-xl text-right flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                    isActiveTrack 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                      : "hover:bg-stone-900 border border-transparent text-stone-300"
                  }`}
                >
                  {/* Delete track - Only shown for custom tracks and ONLY when isAdmin is active */}
                  <div className="flex items-center gap-2">
                    {!track.isPreset ? (
                      isAdmin ? (
                        <button
                          onClick={(e) => handleRemoveTrack(track.id, e)}
                          className="text-stone-500 hover:text-red-400 p-1 opacity-60 group-hover:opacity-100 transition-all"
                          title={lang === "ar" ? "حذف من راديو القرية" : "Delete track"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : null
                    ) : (
                      <span className="text-[8px] bg-amber-900/50 text-amber-400 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                        {lang === "ar" ? "رسمي" : "Preset"}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-500 font-mono shrink-0">{track.duration}</span>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <div className="text-right">
                      <p className="text-[11px] font-bold line-clamp-1">
                        {lang === "ar" ? track.titleAr : track.titleEn}
                      </p>
                      <p className="text-[9px] text-stone-400 line-clamp-1">
                        {lang === "ar" ? track.artistAr : track.artistEn}
                      </p>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isActiveTrack && isPlaying ? "bg-amber-500 text-stone-950 animate-spin" : "bg-stone-800 text-stone-400"
                    }`}>
                      {isActiveTrack && isPlaying ? <Disc className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning/Notes for Live internet streams context */}
      {activeStation.synthType === "live" && (
        <p className="mt-3 text-[10px] text-stone-400 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800 leading-normal text-right">
          💡 <strong>{lang === "ar" ? "ملحوظة البث الحي:" : "Live Stream Service Note:"}</strong>{" "}
          {lang === "ar" 
            ? "يتم تشغيل موجة البث المباشر للإذاعة التونسية عبر الإنترنت. إذا لم يعمل البث في متصفحك، قد يكون ذلك بسبب حظر روابط البث غير المشفرة في شاشة المشاهدة للآي فريم. يمكنك الاستماع دائمًا لمحطات التراث المولّدة محليًا في حالة انقطاع الخدمة!" 
            : "Streams are broadcast live from internet nodes. If the live feed fails to load, it might be due to frame sandbox restrictions. Traditional analog stations are fully generated locally and will always operate smoothly."}
        </p>
      )}

      {/* Independent Standalone Village Radio Segment */}
      <div className="mt-5 space-y-2">
        <label className="text-[10px] font-black text-amber-400 block text-right">
          {lang === "ar" ? "📍 الإذاعة الحرة المستقلة لعين طبرنق (صوت الأهالي):" : lang === "fr" ? "📍 Radio Libre Indépendante d'Ain Tebournok :" : "📍 Independent Standalone Community Radio:"}
        </label>
        
        {STATION_LIST.slice(0, 1).map((st) => {
          const isSelected = currentStationIndex === 0;
          return (
            <button
              id={`station-select-${st.id}`}
              key={st.id}
              onClick={() => handleStationChange(0)}
              className={`w-full text-right p-3.5 rounded-2xl border-2 text-[11px] transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "border-amber-400 bg-amber-500/15 text-amber-300 ring-2 ring-amber-400/20"
                  : "border-amber-900/40 bg-stone-900/30 text-stone-400 hover:border-amber-500/50 hover:text-stone-200"
              }`}
            >
              <div className="flex justify-between items-center w-full mb-1">
                <span className="font-mono text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">{st.frequency}</span>
                <span className="font-black text-xs">
                  {lang === "ar" ? st.nameAr : lang === "fr" ? st.nameFr : st.nameEn}
                </span>
              </div>
              <p className="text-[10px] text-stone-300 leading-normal">
                {lang === "ar" ? st.descAr : lang === "fr" ? st.descFr : st.descEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Grouped Other Tunisian Radio Stations */}
      <div className="mt-4 space-y-2 pt-3 border-t border-stone-800/85">
        <label className="text-[10px] font-bold text-stone-400 block text-right">
          {lang === "ar" ? "📡 باقة الإذاعات الأخرى المتجمعة (أخبار وموسيقى):" : lang === "fr" ? "📡 Sélection de stations tunisiennes groupées :" : "📡 Grouped National & Private Tunisian Broadcasts:"}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {STATION_LIST.slice(1).map((st) => {
            const originalIdx = STATION_LIST.findIndex(s => s.id === st.id);
            const isSelected = originalIdx === currentStationIndex;
            return (
              <button
                id={`station-select-${st.id}`}
                key={st.id}
                onClick={() => handleStationChange(originalIdx)}
                className={`text-right p-2.5 rounded-xl border text-[11px] transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                    : "border-stone-850 bg-stone-900/40 text-stone-400 hover:border-stone-700 hover:text-stone-305"
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-mono text-[9px] opacity-75">{st.frequency}</span>
                  <span className="font-bold truncate">
                    {lang === "ar" ? st.nameAr : lang === "fr" ? st.nameFr : st.nameEn}
                  </span>
                </div>
                <p className="text-[9px] text-stone-500 leading-tight line-clamp-1">
                  {lang === "ar" ? st.descAr : lang === "fr" ? st.descFr : st.descEn}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom tuning & volume sliders */}
      <div className="mt-5 pt-4 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-3">
        
        {/* Procedural Audio Warning Tip */}
        <span className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span>
            {activeStation.synthType === "live" 
              ? (lang === "ar" ? "بث مباشر عبر موجات الويب 📻" : "Internet Web Stream active 📻")
              : activeStation.id === "st-tebournok-free"
                ? (lang === "ar" ? "بث مجتمعي تشاركي حر 📣" : "Interactive Community Stream 📣")
                : (lang === "ar" ? "صوت حيوي مولّد بالذكاء الصوتي التناظري 🍃" : "Real-time procedural analog ambient sound 🍃")}
          </span>
        </span>

        {/* Volume controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="volume-toggle-btn"
            onClick={() => setIsMuted(!isMuted)}
            className="text-stone-400 hover:text-stone-200 outline-none"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            id="radio-vol-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-24 accent-amber-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
          />
          <span className="text-[9px] font-mono text-stone-500">
            {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
