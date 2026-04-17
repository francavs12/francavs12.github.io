"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Music, Tv, Link2, BookOpen, MessageSquare } from "lucide-react"

interface LastFmTrack {
  artist: string
  name: string
  image: string
  nowPlaying: boolean
}

interface AniListEntry {
  title: string
  image: string
  progress: number
}

const ARIA_QUOTES = [
  "No quiero decir que era feliz en ese momento, diría que fui feliz en ese momento, justo como lo soy ahora. — Akari Mizunashi",
  "Cuando una chica cambia su peinado, cambia su forma de ver la vida. — Alicia Florence",
  "No puedes tirar lo que es importante para ti. Se quedan guardados en lo más profundo de tu corazón. — Alicia Florence",
  "Cuando escuchas todos los sonidos a tu alrededor, sientes que el día ha comenzado realmente. — Akari Mizunashi",
  "Como un espejo que te refleja, la gente también reflejará tu corazón. — Athena Glory",
  "Ser capaz de encontrar tu alma gemela casi parece un milagro. ¿Pero no es acaso cada encuentro un milagro en sí mismo? — Akari Mizunashi",
  "¡Las ñoñerías están prohibidas! — Aika S. Granzchesta",
  "Tienes la mayor riqueza de todas porque eliges ser feliz. — Alicia Florence",
  "En vez de decir 'Aquellos fueron buenos tiempos', deberíamos decir 'Aquellos también fueron buenos tiempos'. — Akira E. Ferrari",
  "El hecho de que hayan tantas cosas que tú no conozcas, significa que todavía quedan maravillas ahí afuera. — Alicia Florence",
  "Cuando pasas por el filtro de Akari, ves cosas que nunca habías visto. — Aika y Alice",
  "Porque soy la aliada de Alice-chan. — Athena Glory",
  "¡Solo Alicia puede ser Alicia! No intentes ser otra persona. — Akira E. Ferrari",
  "A este planeta que me ha dado tantos encuentros irremplazables, gracias. — Akari Mizunashi",
  "Si no tienes algo, lo único que tienes que hacer es crearlo. — Aika S. Granzchesta",
]

function PanelBox({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`border border-primary/30 bg-card/60 backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-3 py-2">
        <Icon className="size-3.5 text-accent" />
        <h3 className="text-xs font-medium uppercase tracking-wider text-accent">{title}</h3>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

export function InfoPanel() {
  const [track, setTrack] = useState<LastFmTrack | null>(null)
  const [anime, setAnime] = useState<AniListEntry | null>(null)
  const [quote, setQuote] = useState("")
  const [loadingTrack, setLoadingTrack] = useState(true)
  const [loadingAnime, setLoadingAnime] = useState(true)

  useEffect(() => {
    setQuote(ARIA_QUOTES[Math.floor(Math.random() * ARIA_QUOTES.length)])
  }, [])

  useEffect(() => {
    async function fetchLastFm() {
      try {
        const username = "FranCavs12"
        const apiKey = "2c7d6975c099f7f3f9bee35d245a3ddb"
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
        const response = await fetch(url)
        const data = await response.json()
        const t = data.recenttracks.track[0]
        setTrack({
          artist: t.artist["#text"],
          name: t.name,
          image: t.image[2]["#text"],
          nowPlaying: t["@attr"]?.nowplaying === "true",
        })
      } catch {
        setTrack(null)
      } finally {
        setLoadingTrack(false)
      }
    }

    async function fetchAniList() {
      try {
        const query = `query {
          MediaListCollection(userName:"FranCavs",type:ANIME,status:CURRENT){
            lists{
              entries{
                progress
                media{
                  title{romaji}
                  coverImage{medium}
                }
              }
            }
          }
        }`
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        })
        const data = await response.json()
        const entry = data.data.MediaListCollection.lists[0]?.entries[0]
        if (entry) {
          setAnime({
            title: entry.media.title.romaji,
            image: entry.media.coverImage.medium,
            progress: entry.progress,
          })
        }
      } catch {
        setAnime(null)
      } finally {
        setLoadingAnime(false)
      }
    }

    fetchLastFm()
    fetchAniList()

    const trackInterval = setInterval(fetchLastFm, 30000)
    return () => clearInterval(trackInterval)
  }, [])

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto">
      {/* Music */}
      <PanelBox title="transmisión musical" icon={Music}>
        {loadingTrack ? (
          <div className="text-xs text-muted-foreground">conectando...</div>
        ) : track ? (
          <div className="flex items-start gap-3">
            {track.image && (
              <img
                src={track.image}
                alt={track.name}
                className="size-12 border border-primary/20 object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{track.name}</p>
              <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
              {track.nowPlaying && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-accent">
                  <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                  reproduciendo
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">sin datos</div>
        )}
      </PanelBox>

      {/* Anime */}
      <PanelBox title="actividad anime" icon={Tv}>
        {loadingAnime ? (
          <div className="text-xs text-muted-foreground">consultando...</div>
        ) : anime ? (
          <div className="flex items-start gap-3">
            <img
              src={anime.image}
              alt={anime.title}
              className="h-16 w-auto border border-primary/20 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm text-foreground">{anime.title}</p>
              <p className="mt-1 text-xs text-accent">episodio {anime.progress}</p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">sin datos</div>
        )}
      </PanelBox>

      {/* Links */}
      <PanelBox title="links" icon={Link2}>
        <div className="flex flex-col gap-1.5">
          {[
            { href: "https://x.com/francavs__", label: "twitter" },
            { href: "https://anilist.co/user/FranCavs/", label: "anilist" },
            { href: "https://open.spotify.com/user/tpmais9eyg4hq6p5yawc0fcw8", label: "spotify" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
            >
              <ExternalLink className="size-3 text-muted-foreground transition-colors group-hover:text-primary" />
              {link.label}
            </a>
          ))}
        </div>
      </PanelBox>

      {/* Quote - now smaller */}
      <PanelBox title="registro del sistema" icon={MessageSquare}>
        <p className="text-xs leading-relaxed text-muted-foreground italic">{`"${quote}"`}</p>
      </PanelBox>

      {/* Threads - now larger and takes remaining space */}
      <PanelBox title="archivo de hilos" icon={BookOpen} className="flex-1">
        <div className="flex flex-col gap-1.5 overflow-auto">
          {[
            { name: "blue spring", url: "#" },
            { name: "iyashikei", url: "#" },
            { name: "aria ranking", url: "#" },
            { name: "kozue amano", url: "#" },
            { name: "neo venezia", url: "#" },
            { name: "serial experiments lain", url: "#" },
          ].map((thread) => (
            <a
              key={thread.name}
              href={thread.url}
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              {thread.name}
            </a>
          ))}
        </div>
      </PanelBox>
    </div>
  )
}
