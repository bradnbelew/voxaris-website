import { motion } from "framer-motion";
import { Headphones, Play, Car, Wrench, Home, Ticket } from "lucide-react";
import { useState, useRef } from "react";

const conversations = [
  {
    id: "automotive",
    icon: Car,
    industry: "Automotive",
    title: "Facebook ad lead → Appointment in 90 seconds",
    description: "Maria qualifies a real car buyer, answers questions, and books a test drive.",
    audioSrc: "/audio/maria-dealership-demo.wav",
    available: true
  },
  {
    id: "hvac",
    icon: Wrench,
    industry: "Home Services",
    title: "Emergency cooling call → Same-day service booking",
    description: "AI handles urgent HVAC inquiry and books technician appointment.",
    audioSrc: null,
    available: false
  },
  {
    id: "realestate",
    icon: Home,
    industry: "Real Estate",
    title: "Open house inquiry → Showing appointment booked",
    description: "Prospect from open house sign-in gets immediate callback and showing scheduled.",
    audioSrc: null,
    available: false
  },
  {
    id: "events",
    icon: Ticket,
    industry: "Events",
    title: "Ticket inquiry → VIP upgrade conversion",
    description: "Lead considering tickets gets called back and converts to premium package.",
    audioSrc: null,
    available: false
  }
];

export default function ConversationIntelligenceSection() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
            <Headphones className="w-4 h-4" />
            Conversation Intelligence
          </span>
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Hear What Makes Our AI Different
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Listen to real conversations. See how Maria handles objections, qualifies leads, and books appointments — just like your best salesperson.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Industry selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            {conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => convo.available && setSelectedConversation(convo)}
                disabled={!convo.available}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedConversation.id === convo.id
                    ? "bg-primary/10 border-primary/30"
                    : convo.available
                    ? "bg-card border-border hover:border-primary/20 hover:bg-card/80"
                    : "bg-secondary/30 border-border/50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedConversation.id === convo.id ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <convo.icon className={`h-5 w-5 ${
                      selectedConversation.id === convo.id ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{convo.industry}</div>
                    {!convo.available && (
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Audio player and details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <selectedConversation.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-primary font-medium">
                    {selectedConversation.industry}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mt-1">
                    {selectedConversation.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {selectedConversation.description}
                  </p>
                </div>
              </div>

              {/* Audio player */}
              {selectedConversation.available && selectedConversation.audioSrc ? (
                <div className="bg-secondary/30 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={handlePlay}
                      className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
                    >
                      <Play className={`h-6 w-6 text-primary-foreground ${isPlaying ? "opacity-0" : "ml-0.5"}`} />
                      {isPlaying && (
                        <div className="absolute flex gap-1">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-primary-foreground rounded-full"
                              animate={{ height: [8, 16, 8] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.1
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        Maria Demo Call
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Real call recording • Auto dealership lead
                      </div>
                    </div>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    src={selectedConversation.audioSrc}
                    onEnded={handleAudioEnded}
                    className="w-full h-10"
                    controls
                    preload="metadata"
                  />
                </div>
              ) : (
                <div className="bg-secondary/30 rounded-xl p-8 text-center">
                  <Headphones className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    {selectedConversation.industry} demo coming soon.
                  </p>
                </div>
              )}

              {/* Call highlights */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-4">What to Listen For</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Natural conversation flow",
                    "Objection handling",
                    "Appointment booking",
                    "Data capture accuracy"
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
