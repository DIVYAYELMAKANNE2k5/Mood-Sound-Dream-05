import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Timer, Heart, Save, Waves, CloudRain, Wind, TreePine, Sun, Moon, Monitor } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

interface SoundLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  audioUrl: string;
  volume: number;
  isPlaying: boolean;
  audio?: HTMLAudioElement;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  sounds: { id: string; volume: number }[];
  gradient: string;
  videoId: string;
}

const presets: Preset[] = [
  {
    id: 'deep-sleep',
    name: 'Deep Sleep',
    description: 'Delta waves for the deepest healing sleep',
    sounds: [
      { id: 'rain', volume: 70 },
      { id: 'white-noise', volume: 40 }
    ],
    gradient: 'from-blue-900 to-purple-900',
    videoId: 'rCSCPujLs14'
  },
  {
    id: 'ocean-meditation',
    name: 'Ocean Meditation',
    description: 'Guided ocean meditation for mindfulness',
    sounds: [
      { id: 'ocean', volume: 80 },
      { id: 'wind', volume: 30 }
    ],
    gradient: 'from-teal-700 to-blue-800',
    videoId: 'QR3lp0ptpy8'
  },
  {
    id: 'forest-focus',
    name: 'Forest Focus',
    description: 'Deep instrumental chillout for concentration',
    sounds: [
      { id: 'forest', volume: 60 },
      { id: 'wind', volume: 40 }
    ],
    gradient: 'from-green-800 to-teal-800',
    videoId: 'ct3taM8HWwo'
  },
  {
    id: 'rainy-evening',
    name: 'Rainy Evening',
    description: 'Thunderstorm with warm fireplace ambience',
    sounds: [
      { id: 'rain', volume: 85 },
      { id: 'thunder', volume: 25 }
    ],
    gradient: 'from-gray-800 to-blue-900',
    videoId: 'o8GrqUSdzi0'
  }
];

const SoundscapeApp = () => {
  const { theme, setTheme } = useTheme();
  const [soundLayers, setSoundLayers] = useState<SoundLayer[]>([
    {
      id: 'rain',
      name: 'Rain',
      icon: <CloudRain className="w-5 h-5" />,
      audioUrl: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
      volume: 50,
      isPlaying: false
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      icon: <Waves className="w-5 h-5" />,
      audioUrl: 'https://www.soundjay.com/misc/sounds/ocean_waves.wav',
      volume: 50,
      isPlaying: false
    },
    {
      id: 'wind',
      name: 'Wind',
      icon: <Wind className="w-5 h-5" />,
      audioUrl: 'https://www.soundjay.com/misc/sounds/wind.wav',
      volume: 50,
      isPlaying: false
    },
    {
      id: 'forest',
      name: 'Forest',
      icon: <TreePine className="w-5 h-5" />,
      audioUrl: 'https://www.soundjay.com/misc/sounds/forest.wav',
      volume: 50,
      isPlaying: false
    }
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showVideo, setShowVideo] = useState<string | false>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('soundscape-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleStop();
      setTimeRemaining(null);
      setTimer(null);
      toast({
        title: "Sleep timer finished",
        description: "Soundscape has gently faded out. Sweet dreams!",
      });
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining]);

  const updateSoundVolume = (id: string, volume: number) => {
    setSoundLayers(layers =>
      layers.map(layer => {
        if (layer.id === id) {
          if (layer.audio) {
            layer.audio.volume = volume / 100;
          }
          return { ...layer, volume };
        }
        return layer;
      })
    );
  };

  const toggleSound = (id: string) => {
    setSoundLayers(layers =>
      layers.map(layer => {
        if (layer.id === id) {
          // For demo purposes, we'll simulate audio playback
          // In a real app, you'd load actual audio files
          const newPlaying = !layer.isPlaying;
          
          if (newPlaying && !layer.audio) {
            // Create audio element (simulated for demo)
            const audio = new Audio();
            audio.loop = true;
            audio.volume = layer.volume / 100;
            layer.audio = audio;
          }
          
          if (layer.audio) {
            if (newPlaying) {
              layer.audio.play().catch(() => {
                // Handle audio play errors silently for demo
              });
            } else {
              layer.audio.pause();
            }
          }
          
          return { ...layer, isPlaying: newPlaying };
        }
        return layer;
      })
    );
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handleStop();
    } else {
      setIsPlaying(true);
      // Start playing all active layers
      soundLayers.forEach(layer => {
        if (layer.volume > 0) {
          toggleSound(layer.id);
        }
      });
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setSoundLayers(layers =>
      layers.map(layer => {
        if (layer.audio) {
          layer.audio.pause();
          layer.audio.currentTime = 0;
        }
        return { ...layer, isPlaying: false };
      })
    );
  };

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    setSoundLayers(layers =>
      layers.map(layer => {
        const presetSound = preset.sounds.find(s => s.id === layer.id);
        const volume = presetSound ? presetSound.volume : 0;
        
        if (layer.audio) {
          layer.audio.volume = volume / 100;
        }
        
        return { ...layer, volume };
      })
    );

    setSelectedPreset(presetId);
    toast({
      title: `Applied ${preset.name}`,
      description: preset.description,
    });
  };

  const setTimerDuration = (minutes: number) => {
    setTimer(minutes);
    setTimeRemaining(minutes * 60);
    toast({
      title: `Timer set for ${minutes} minutes`,
      description: "Your soundscape will gently fade out when the timer ends.",
    });
  };

  const saveFavorite = () => {
    const soundscapeConfig = soundLayers.map(layer => ({
      id: layer.id,
      volume: layer.volume
    }));
    
    const configString = JSON.stringify(soundscapeConfig);
    const newFavorites = [...favorites, configString];
    setFavorites(newFavorites);
    localStorage.setItem('soundscape-favorites', JSON.stringify(newFavorites));
    
    toast({
      title: "Soundscape saved",
      description: "Your current mix has been saved to favorites!",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-ambient relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-ocean-medium rounded-full animate-float blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-ambient rounded-full animate-float animation-delay-2000 blur-lg"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-amber-warm rounded-full animate-breathe blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-ocean-light to-purple-ambient bg-clip-text text-transparent">
              Peaceful Soundscapes
            </h1>
            <p className="text-xl text-muted-foreground">
              Create your perfect environment for relaxation and deep sleep
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
            <Button
              variant={theme === 'light' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('light')}
              className="rounded-full w-9 h-9 p-0"
            >
              <Sun className="w-4 h-4" />
            </Button>
            <Button
              variant={theme === 'system' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('system')}
              className="rounded-full w-9 h-9 p-0"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={theme === 'dark' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="rounded-full w-9 h-9 p-0"
            >
              <Moon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Control Panel */}
        <Card className="bg-gradient-glass backdrop-blur-ambient border-border/50 shadow-ambient mb-8">
          <div className="p-8">
            {/* Play Controls & Timer */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="bg-gradient-ocean hover:shadow-glow transition-all duration-300 h-16 w-16 rounded-full"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
              
              {timeRemaining && (
                <div className="text-center">
                  <div className="text-3xl font-mono text-ocean-light mb-1">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-muted-foreground">remaining</div>
                </div>
              )}
            </div>

            {/* Sound Layers */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {soundLayers.map((layer) => (
                <Card key={layer.id} className="bg-glass/50 border-border/30 hover:bg-glass/70 transition-colors">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-ocean rounded-lg text-white">
                          {layer.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{layer.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            Volume: {layer.volume}%
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={layer.isPlaying ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleSound(layer.id)}
                        className="transition-all duration-300"
                      >
                        {layer.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <Slider
                        value={[layer.volume]}
                        onValueChange={(value) => updateSoundVolume(layer.id, value[0])}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Presets */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-ambient" />
                Mood Presets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {presets.map((preset) => (
                  <div key={preset.id} className="space-y-2">
                    <Button
                      variant={selectedPreset === preset.id ? "secondary" : "outline"}
                      onClick={() => applyPreset(preset.id)}
                      className="h-auto p-4 flex flex-col items-start gap-2 transition-all duration-300 hover:shadow-ambient w-full"
                    >
                      <div className="font-semibold text-left">{preset.name}</div>
                      <div className="text-xs text-muted-foreground text-left">
                        {preset.description}
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVideo(prev => prev === preset.videoId ? false : preset.videoId)}
                      className="w-full text-xs"
                    >
                      {showVideo === preset.videoId ? 'Hide Video' : 'Show Video'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Player */}
            {showVideo && presets.find(p => p.videoId === showVideo) && (
              <div className="mb-8">
                <Card className="bg-glass/50 border-border/30 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {presets.find(p => p.videoId === showVideo)?.name} Experience
                    </h3>
                    <div className="aspect-video w-full rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${showVideo}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                        title="Soundscape Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Timer & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Timer className="w-5 h-5 text-amber-warm" />
                <div className="flex gap-2">
                  {[15, 30, 60, 120].map((minutes) => (
                    <Button
                      key={minutes}
                      variant={timer === minutes ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setTimerDuration(minutes)}
                    >
                      {minutes}m
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={saveFavorite}
                variant="outline"
                className="flex items-center gap-2 hover:bg-gradient-sunset hover:text-white transition-all duration-300"
              >
                <Save className="w-4 h-4" />
                Save Mix
              </Button>
            </div>
          </div>
        </Card>

        {/* Status */}
        {isPlaying && (
          <div className="text-center">
            <Badge variant="secondary" className="animate-breathe bg-gradient-ocean text-white border-none">
              Playing your personalized soundscape
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundscapeApp;