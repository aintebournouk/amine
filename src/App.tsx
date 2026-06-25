import React, { useState, useEffect, useRef } from "react";
import { 
  Compass, 
  BookOpen, 
  Sprout, 
  Calendar, 
  MapPin, 
  MessageSquare, 
  Radio as RadioIcon, 
  Mail, 
  Inbox,
  Bell,
  Heart
} from 'lucide-react';
  ChevronRight, 
  Languages, 
  ChevronLeft, 
  CheckCircle2, 
  Info, 
  Sparkles, \n  AlertCircle,
  Clock,
  ArrowRight,
  Lock,
  Unlock,
  Trash2,
  UploadCloud,
  Plus,
  Send,
  Sun,
  Moon,
  Eye,
  Gift,
  Video,
  Share2,
  Link,
  Smartphone,
  Download,
  Laptop,
  Cloud,
  ExternalLink
} from "lucide-react";

import { Language, TRANSLATIONS, Landmark, LANDMARKS, GALLERY_PHOTOS } from "./types";
import RadioPlayer from "./components/RadioPlayer";
import InteractiveMap from "./components/InteractiveMap";
import WeatherWidget from "./components/WeatherWidget";

// مكوّن المشاركة الذكي
const ShareButtons = ({ 
  title, 
  text, 
  url, 
  lang 
}: { 
  title: string; 
  text: string; \n  url?: string; \n  lang: string; \n}) => {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUrl = url || typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(currentUrl);
    const shareText = encodeURIComponent(`${title}\n${text}`);
    
    let targetUrl = '';
    if (platform === 'facebook') targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    else if (platform === 'twitter') targetUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
    else if (platform === 'whatsapp') targetUrl = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
    else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
      setShowOptions(false);
      return;
    }
    
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
    setShowOptions(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="p-2.5 rounded-xl text-xs font-black bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
      >
        <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>{lang === "ar" ? "مشاركة" : "Partager"}</span>
      </button>
      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-xl border border-stone-100 dark:border-zinc-800 z-50 text-right font-bold text-xs animate-fade-in">
          <button onClick={() => handleShare('facebook')} className="w-full text-right p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 flex items-center justify-between">
            <span>فيسبوك</span> <span className="text-blue-600">FB</span>
          </button>
          <button onClick={() => handleShare('twitter')} className="w-full text-right p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 flex items-center justify-between">
            <span>منصة X</span> <span className="text-black dark:text-white">X</span>
          </button>
          <button onClick={() => handleShare('whatsapp')} className="w-full text-right p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 flex items-center justify-between">
            <span>واتساب</span> <span className="text-green-500">WA</span>
          </button>
          <hr className="my-1.5 border-stone-100 dark:border-zinc-800" />
          <button onClick={() => handleShare('copy')} className="w-full text-right p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-black">
            {copied ? "تم النسخ!" : "نسخ الرابط"}
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>("ar");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  
  // روابط تطبيق الهاتف المدارة من قبل المشرف
  const [appLink, setAppLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // حالات البيانات (الأخبار والفعاليات والرسائل والمحادثة)
  const [news, setNews] = useState([
    { id: 1, title: "انطلاق موسم السياحة الجبلية في عين طبرنق", date: "2026-06-15", category: "سياحة" },
    { id: 2, title: "أشغال صيانة وتأمين محيط السد استعداداً لفصل الصيف", date: "2026-06-10", category: "بيئة" }
  ]);
  const [events, setEvents] = useState([
    { id: 1, title: "جولة المشي الجبلي الاستكشافية الكبرى", date: "2026-06-28", time: "07:00" }
  ]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "أهلاً بك يا بني في عين طبرنق، أنا العم مفتاح. اسألني عن تاريخ قريتنا المنسية أو سدنا الجميل ومقابرنا الرومانية وعيني سأجيبك بكل حكمة ودفا." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // إدخال نماذج الإدارة
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "tabernok2026") {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPassword("");
    } else {
      alert("كلمة المرور خاطئة!");
    }
  };

  // دالة المحادثة مع العم مفتاح - متوافقة مع Vercel سحابياً
  const handleSendToMeftah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userText = chatMessage.trim();
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: "user", text: userText }]);
    setIsChatLoading(true);

    const API_BASE_URL = window.location.hostname === "localhost" 
      ? "http://localhost:5000" 
      : window.location.origin;

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat-meftah`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: chatHistory }),
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: "model", text: data.reply || "سامحني يا بني، لم أسمعك جيداً. أعد سؤالك." }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "model", text: "يا بني، يبدو أن هناك عطلاً في الاتصال بالشبكة حالياً. حاول مجدداً لاحقاً." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 font-sans transition-colors duration-200 antialiased selection:bg-emerald-200">
      
      {/* أولاً وثانياً وثالثاً وتاسعاً: شريط التنقل المتجاوب والمصلح بالكامل */}
      <header className="sticky top-0 z-50 w-full bg-stone-50/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-stone-200/60 dark:border-zinc-800/60 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            
            {/* ثالثاً: العنوان الرئيسي متجاوب على الجوال */}
            <div className="text-center md:text-right">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#1b4332] dark:text-emerald-400 tracking-wide font-serif">
                {lang === "ar" ? "عين تبرنق — القرية المنسية" : "Ain Tebournok — The Forgotten Village"}
              </h1>
            </div>

            {/* ثانياً: أزرار اللغات بألوان صارمة (أخضر جبلي للمفعّلة / رمادي غامق للمطفأة) */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-stone-200/60 dark:border-zinc-700/60 shadow-inner">
                <button
                  onClick={() => setLang("ar")}
                  className={`text-xs font-black transition-all duration-200 px-3 py-1 rounded-full cursor-pointer ${
                    lang === "ar"
                      ? "text-white bg-[#2d6a4f] shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-[#2d6a4f]"
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLang("fr")}
                  className={`text-xs font-black transition-all duration-200 px-3 py-1 rounded-full cursor-pointer ${
                    lang === "fr"
                      ? "text-white bg-[#2d6a4f] shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-[#2d6a4f]"
                  }`}
                >
                  Français
                </button>
              </div>

              {/* وضع الإضاءة / الليل */}
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 cursor-pointer">
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* زر الدخول كمشرف */}
              <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} className="p-2 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 cursor-pointer">
                {isAdmin ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* أولاً وثالثاً: القائمة مبنية في سطرين على الجوال وتظهر كاملة */}
          <nav className="mt-3 pt-2 border-t border-stone-200/40 dark:border-zinc-800/40">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:flex md:flex-wrap md:justify-center md:gap-5 text-center text-[11px] sm:text-xs md:text-sm font-bold">
              <li><a href="#about" className="block p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-[#2d6a4f] hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all">{lang === "ar" ? "نبذة عن القرية" : "About Village"}</a></li>
              <li><a href="#history" className="block p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-[#2d6a4f] hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all">{lang === "ar" ? "التاريخ والآثار" : "History & Ruins"}</a></li>
              <li><a href="#tourism" className="block p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-[#2d6a4f] hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all">{lang === "ar" ? "السياحة الجبلية" : "Mountain Tourism"}</a></li>
              <li><a href="#radio" className="block p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-[#2d6a4f] hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all">{lang === "ar" ? "الإذاعة المحلية" : "Local Radio"}</a></li>
              <li><a href="#meftah-chat" className="block p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-[#2d6a4f] hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all">{lang === "ar" ? "العم مفتاح" : "Uncle Meftah"}</a></li>
              <li><a href="#news" className="block p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-[#2d6a4f] hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all">{lang === "ar" ? "آخر الأخبار" : "Latest News"}</a></li>
              <li><a href="#app" className="block p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-[#2d6a4f] hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all">{lang === "ar" ? "تطبيق الهاتف" : "Mobile App"}</a></li>

              {/* تاسعاً: صندوق رسائل المشرف - مخفي تماماً ومحمي بصلاحية المشرف فقط */}
              {isAdmin && (
                <li className="col-span-2 sm:col-span-1">
                  <button onClick={() => setIsInboxOpen(true)} className="w-full text-center p-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50 font-black animate-pulse flex items-center justify-center gap-1 cursor-pointer">
                    <span>📥 {lang === "ar" ? "رسائل المشرف" : "Admin Messages"}</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* البطل (Hero Section) */}
      <section className="relative bg-stone-900 text-white overflow-hidden py-32 border-b-4 border-amber-500/40">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="relative max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="inline-block bg-emerald-600/90 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">{lang === "ar" ? "📍 ولاية نابل، تونس" : "📍 Nabeul, Tunisia"}</span>
          <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-stone-100">{lang === "ar" ? "اكتشف سحر الطبيعة وعراقة التاريخ" : "Explore Majestic Nature & Deep History"}</h2>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base font-medium">{lang === "ar" ? "مرحباً بكم في الدليل التفاعلي الشامل لقرية عين طبرنق. هنا تلتقي الجبال الخضراء بالآثار الرومانية العتيقة وسدها العظيم الفاتن." : "Welcome to the interactive guide of Ain Tebournok. A hidden paradise where lush mountains meet timeless Roman ruins."}</p>
          <div className="pt-4"><a href="#about" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md inline-flex items-center gap-2 text-xs sm:text-sm">{lang === "ar" ? "ابدأ جولاتك الاستكشافية" : "Start Exploring"} <ArrowRight className="w-4 h-4" /></a></div>
        </div>
      </section>

      {/* رابعاً وخامساً: قسم نبذة عن القرية والصور المنقحة من الكلمات المبهمة */}
      <section id="about" className="py-20 bg-stone-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-[#1b4332] dark:text-emerald-400 font-serif">{lang === "ar" ? "حول قرية عين طبرنق الساحرة" : "About Beautiful Ain Tebournok"}</h3>
              <p className="text-stone-600 dark:text-zinc-400 leading-relaxed text-xs sm:text-sm md:text-base font-medium">
                {lang === "ar" 
                  ? "تعتبر عين طبرنق من أعرق القرى التونسية التابعة لولاية نابل، حيث تجمع بين سحر الطبيعة الخلابة المتمثلة في سدها العظيم وجبالها الخضراء الممتدة، وبين التاريخ العريق الذي تفوح منه رائحة الحضارة الرومانية القديمة بمعالمها ومقابرها الأثرية."
                  : "Ain Tebournok is an ancient Tunisian village in Nabeul, marrying natural beauty of its grand dam and rich green peaks with historically prominent Roman landmarks and ruins."}
              </p>
              <WeatherWidget lang={lang} />
            </div>
            
            {/* صور ثابتة مستقرة لضمان عدم الاختفاء على فيرسيل */}
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80" alt="Nature" className="rounded-2xl shadow-sm object-cover h-48 w-full border border-stone-200/60" />
              <img src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=800&q=80" alt="Ruins" className="rounded-2xl shadow-sm object-cover h-48 w-full border border-stone-200/60" />
            </div>
          </div>
        </div>
      </section>

      {/* المعالم والتاريخ والآثار */}
      <section id="history" className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1b4332] dark:text-emerald-400 font-serif">{lang === "ar" ? "🏛️ معالم تاريخية وحضارية عريقة" : "🏛️ Timeless Historical Landmarks"}</h3>
            <p className="text-stone-500 dark:text-zinc-400 text-xs sm:text-sm mt-2">{lang === "ar" ? "شواهد حية على الحضارات المتعاقبة التي مرت بالمنطقة وصنعت مجدها وتراثها الإنساني" : "Living testaments to the civilizations that shaped the identity of our village."}</p>
          </div>
          <InteractiveMap lang={lang} />
        </div>
      </section>

      {/* سادساً: الإذاعة المحلية المتوافقة مع روابط HTTPS الآمنة */}
      <section id="radio" className="py-16 bg-stone-50 dark:bg-zinc-950 border-y border-stone-200/60 dark:border-zinc-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-[#1b4332] dark:text-emerald-400 mb-6 flex items-center justify-center gap-2">
            <RadioIcon className="w-6 h-6 text-emerald-600" />
            <span>{lang === "ar" ? "الإذاعة التفاعلية لعين طبرنق" : "Interactive Radio Station"}</span>
          </h3>
          <RadioPlayer lang={lang} defaultStationUrl="https://rtci.bstream.tn/rtci.mp3" />
        </div>
      </section>

      {/* سابعاً: قسم المحادثة الذكية مع العم مفتاح */}
      <section id="meftah-chat" className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#fcfbf9] dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
            <div className="p-8 bg-[#1b4332] text-white space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-stone-100/10 rounded-2xl flex items-center justify-center text-3xl">🧓</div>
                <h4 className="text-xl font-black font-serif">{lang === "ar" ? "العم مفتاح (70 عاماً)" : "Uncle Meftah (70 yo)"}</h4>
                <p className="text-xs text-stone-300 leading-relaxed font-medium">
                  {lang === "ar" 
                    ? "حارس التاريخ الشفوي والذاكرة التراثية لعين طبرنق. اسأله بلطف ليحدثك كأنك ابنه عن تفاصيل تاريخ السد والآثار." 
                    : "The gatekeeper of Ain Tebournok's memory. Ask him any question about history, the dam, or local pathways."}
                </p>
              </div>
              <div className="text-[10px] text-emerald-300/80 font-mono">Powered by Gemini Pro API</div>
            </div>
            
            <div className="col-span-2 flex flex-col h-[400px] bg-stone-50/50 dark:bg-zinc-950/40">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-medium">
                {chatHistory.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl shadow-xs leading-relaxed ${chat.role === "user" ? "bg-[#2d6a4f] text-white rounded-br-none" : "bg-white dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 rounded-bl-none border border-stone-100 dark:border-zinc-700"}`}>
                      {chat.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="text-left text-stone-400 italic text-[11px] animate-pulse">👴 العم مفتاح يتذكر الآن...</div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <form onSubmit={handleSendToMeftah} className="p-3 border-t border-stone-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={lang === "ar" ? "اسأل العم مفتاح شيئاً..." : "Ask Uncle Meftah..."}
                  className="flex-1 p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="p-2.5 bg-[#2d6a4f] text-white rounded-xl hover:bg-[#1b4332] transition shadow-xs cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* الأخبار المرئية والمحسنة */}
      <section id="news" className="py-20 bg-stone-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-black text-[#1b4332] dark:text-emerald-400 font-serif text-center mb-12">{lang === "ar" ? "آخر مستجدات وأخبار القرية" : "Village Bulletin & News"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {news.map(item => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-stone-200/60 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/40 text-[#2d6a4f] px-2.5 py-1 rounded-md">{item.category}</span>
                  <h4 className="text-sm font-bold text-stone-800 dark:text-zinc-200 mt-3">{item.title}</h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mt-6 pt-3 border-t border-stone-100 dark:border-zinc-800">
                  <span>📅 {item.date}</span>
                  {isAdmin && (
                    <button onClick={() => setNews(news.filter(n => n.id !== item.id))} className="text-red-500 font-bold hover:underline cursor-pointer">حذف</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ثامناً: قسم تطبيق الهاتف الجوال المحسن والمفرغ بالكامل بانتظار الروابط من لوحة التحكم */}
      <section id="app" className="py-20 bg-white dark:bg-zinc-900 border-t border-stone-200/60 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-[#1b4332] dark:text-emerald-400 mb-4 font-serif">
            {lang === "ar" ? "تطبيق الهاتف الجوال لعين طبرنق" : "Ain Tebournok Mobile App"}
          </h2>
          
          <div className="my-8 min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-stone-300 dark:border-zinc-700 bg-stone-50/50 dark:bg-zinc-950/40 rounded-2xl p-6 max-w-md mx-auto shadow-sm">
            {appLink && qrCodeUrl ? (
              <div className="space-y-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto rounded-xl shadow-xs" />
                <a href={appLink} target="_blank" rel="noreferrer" className="inline-block text-emerald-600 dark:text-emerald-400 font-bold underline hover:text-[#1b4332]">
                  {lang === "ar" ? "تحميل التطبيق مباشرة" : "Download App Directly"}
                </a>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="w-10 h-10 bg-stone-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-stone-400">⏳</div>
                <p className="text-stone-400 dark:text-zinc-500 italic text-xs font-medium">
                  {lang === "ar" 
                    ? "مساحة مخصصة لرابط التطبيق ورمز الـ QR (سيتم تفعيلها فور اكتمال النشر على المتاجر)" 
                    : "Space reserved for App Link & QR Code (Will be live upon store deployment)"}
                </p>
              </div>
            )}
          </div>

          {/* لوحة تحكم مرئية مخصصة للمشرف لتعديل الروابط مرئياً وضغطة زر */}
          {isAdmin && (
            <div className="bg-stone-50 dark:bg-zinc-950 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 text-right mt-6 max-w-md mx-auto shadow-md">
              <h4 className="font-black text-stone-800 dark:text-zinc-200 mb-3 text-sm">🔧 إدارة الروابط (للمشرف)</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-zinc-400 mb-1 font-bold">رابط تحميل التطبيق:</label>
                  <input type="text" value={appLink} onChange={(e) => setAppLink(e.target.value)} className="w-full p-2.5 border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl outline-none" placeholder="https://play.google.com/store/..." />
                </div>
                <div>
                  <label className="block text-stone-600 dark:text-zinc-400 mb-1 font-bold">رابط صورة الـ QR:</label>
                  <input type="text" value={qrCodeUrl} onChange={(e) => setQrCodeUrl(e.target.value)} className="w-full p-2.5 border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl outline-none" placeholder="https://.../qr.png" />
                </div>
                <button onClick={() => alert("تم تحديث روابط التطبيق مرئياً!")} className="w-full bg-[#2d6a4f] text-white py-2 rounded-xl font-bold hover:bg-[#1b4332] transition shadow-xs cursor-pointer">تحديث الرابط والرمز التعبيري</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* لوحة تحكم الإدارة المرئية في أسفل الموقع - تعمل بالكامل كـ Table Editor */}
      {isAdmin && (
        <section className="py-12 bg-amber-50/40 dark:bg-zinc-950 border-t-2 border-amber-200/50">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-amber-200/60 shadow-lg text-right">
              <h3 className="text-lg font-black text-amber-900 dark:text-amber-400 border-b pb-2 mb-4">📊 لوحة التحكم والمحرر المرئي للمحتوى</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-stone-700 dark:text-zinc-300">➕ إضافة خبر جديد للواجهة</h4>
                  <div className="flex gap-2">
                    <input type="text" value={newNewsTitle} onChange={(e) => setNewNewsTitle(e.target.value)} className="flex-1 p-2 border rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 outline-none" placeholder="عنوان الخبر..." />
                    <button onClick={() => { if (newNewsTitle.trim()) { setNews([...news, { id: Date.now(), title: newNewsTitle, date: new Date().toISOString().split('T')[0], category: "تحديث" }]); setNewNewsTitle(""); } }} className="bg-[#2d6a4f] text-white px-4 rounded-xl text-xs font-bold cursor-pointer">إضافة</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-stone-700 dark:text-zinc-300">➕ إضافة فعالية أو نشاط</h4>
                  <div className="flex flex-col gap-2">
                    <input type="text" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className="p-2 border rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 outline-none" placeholder="اسم الفعالية..." />
                    <div className="flex gap-2">
                      <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="flex-1 p-2 border rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 outline-none" />
                      <button onClick={() => { if (newEventTitle.trim()) { setEvents([...events, { id: Date.now(), title: newEventTitle, date: newEventDate || new Date().toISOString().split('T')[0], time: "08:00" }]); setNewEventTitle(""); setNewEventDate(""); } }} className="bg-[#2d6a4f] text-white px-4 rounded-xl text-xs font-bold cursor-pointer">إضافة</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* تذييل الصفحة (Footer) */}
      <footer className="bg-[#1b4332] text-stone-200 py-12 text-center border-t-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p className="font-serif text-lg font-black text-amber-400">عين تبرنق — القرية المنسية</p>
          <p className="text-xs text-stone-300/80">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* نافذة تسجيل الدخول للمشرف (Modal) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-zinc-800 shadow-2xl text-right space-y-4 animate-fade-in">
            <h3 className="text-sm font-black text-stone-800 dark:text-zinc-200">🔐 تسجيل الدخول للوحة التحكم المرئية</h3>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="أدخل كلمة مرور الإدارة..." className="w-full p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="flex gap-2 justify-end text-xs font-bold pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white cursor-pointer">دخول</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}