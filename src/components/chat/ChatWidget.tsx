import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
  images?: string[];
}

const initialBotGreeting: ChatMessage = {
  id: "greet-1",
  role: "bot",
  content:
    "Hi! I'm Bloom Assistant. Ask me about services, pricing, availability, or how to contact us.",
  timestamp: Date.now(),
};

const siteContext = `
Brand: Bloom Wedding Photography.
Primary pages: /services, /booking, /gallery, /contact.
What we do: Wedding, engagement, and event photography with creative, candid storytelling.
Guidance:
- Services & pricing: Explain packages at /services. Invite sharing date/event details for tailored quote.
- Booking: Guide to /booking to check availability and submit details.
- Our work: Describe our natural, timeless style and direct to /gallery to view photos.
- Event suggestions: Offer ideas for timelines, shot lists, decor lighting tips, and seasonal suggestions.
Tone: Warm, professional, concise. Always include relevant internal links where helpful.
`;

function pickBotReply(input: string): string {
  const text = input.toLowerCase();
  if (/(hi|hello|hey)/.test(text)) return "Hello! How can I help you today?";
  if (/price|pricing|cost/.test(text))
    return "Our pricing varies by package. See Services for details, or share your date for a tailored quote.";
  if (/service|package|plan/.test(text))
    return "We offer multiple photography packages. Visit the Services page to explore what's included.";
  if (/book|availability|schedule|date/.test(text))
    return "You can check availability and submit a request on the Booking page.";
  if (/contact|phone|email|reach/.test(text))
    return "You can reach us via the Contact page form. We'll reply promptly!";
  if (/gallery|portfolio|work/.test(text))
    return "Browse our Gallery to see recent shoots and styles we love.";
  return "Got it! I’ll note that. Do you want details on Services, Booking, or Contact?";
}

const galleryImages = [g1, g2, g3, g4, g5, g6];

function detectImageRequest(input: string): boolean {
  const text = input.toLowerCase();
  return /photo|photos|picture|pictures|shots|gallery|portfolio|see (our|the)? (photos|images)|show (me )?(photos|images)|see.*work/.test(text);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotGreeting]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    if (!canSend) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("chat-assistant", {
        body: {
          prompt: userMsg.content,
          context: siteContext,
        },
      });

      const replyText: string = (data as any)?.reply || pickBotReply(userMsg.content);
      const images = detectImageRequest(userMsg.content) ? galleryImages.slice(0, 4) : undefined;
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "bot",
        content: replyText + (images ? " Here are a few from our gallery. For more, visit /gallery." : ""),
        timestamp: Date.now(),
        images,
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      const images = detectImageRequest(userMsg.content) ? galleryImages.slice(0, 4) : undefined;
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "bot",
        content: pickBotReply(userMsg.content) + (images ? " Here are a few from our gallery. For more, visit /gallery." : ""),
        timestamp: Date.now(),
        images,
      };
      setMessages((prev) => [...prev, reply]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <Button
          aria-label="Open chat"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 rounded-full shadow-lg z-50"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Bloom Assistant"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[22rem] md:w-[26rem] h-[28rem] rounded-xl border bg-background text-foreground shadow-lg flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-medium">Bloom Assistant</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-3 py-3" aria-live="polite" aria-relevant="additions">
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col">
                  <div
                    className={
                      m.role === "user"
                        ? "ml-auto max-w-[80%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm"
                        : "mr-auto max-w-[80%] rounded-lg bg-muted text-muted-foreground px-3 py-2 text-sm"
                    }
                  >
                    {m.content}
                  </div>
                  {m.images && m.images.length > 0 && (
                    <div className="mr-auto mt-2 grid grid-cols-2 gap-2 max-w-[80%]">
                      {m.images.map((src, idx) => (
                        <img
                          key={src}
                          src={src}
                          alt={`Gallery photo ${idx + 1} - Bloom Wedding Photography`}
                          loading="lazy"
                          className="h-28 w-full object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex">
                  <div className="mr-auto max-w-[80%] rounded-lg bg-muted text-muted-foreground px-3 py-2 text-sm">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          {/* Composer */}
          <form
            className="p-3 border-t flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              aria-label="Type your message"
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!canSend} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
