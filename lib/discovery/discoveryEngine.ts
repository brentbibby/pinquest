// ==========================================
// PINQUEST Discovery Engine
// Version 1.0
// ==========================================

export type DiscoveryResult = {
  success: boolean;
  coinsAwarded: number;
  xpAwarded: number;
  title: string;
  message: string;
};

const celebrationMessages = [
  {
    title: "🎉 Congratulations!",
    message: "Every pin tells a story."
  },

  {
    title: "🌍 Fantastic Discovery!",
    message: "The world is waiting for your next adventure."
  },

  {
    title: "⭐ Well Done!",
    message: "Adventure belongs to those who explore."
  },

  {
    title: "🏆 Outstanding!",
    message: "Great explorers never stop discovering."
  },

  {
    title: "📍 Discovery Complete!",
    message: "Another unforgettable place joins your journey."
  },

  {
    title: "✨ Amazing!",
    message: "Today's discovery becomes tomorrow's memory."
  },

  {
    title: "🚀 Excellent!",
    message: "One more pin. One more adventure."
  },

  {
    title: "👏 Great Job!",
    message: "Keep exploring. Keep inspiring."
  },

  {
    title: "💚 PINQUEST!",
    message: "The adventure has only just begun."
  },

  {
    title: "🥇 Explorer!",
    message: "Every discovery makes the world a little smaller."
  }
];

export function claimDiscovery(): DiscoveryResult {

  const random =
    celebrationMessages[
      Math.floor(Math.random() * celebrationMessages.length)
    ];

  return {

    success: true,

    coinsAwarded: 250,

    xpAwarded: 50,

    title: random.title,

    message: random.message

  };

}