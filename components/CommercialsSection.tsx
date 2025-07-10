import React from 'react';

const VideoCard = ({ title, videoId }: { title: string, videoId: string }) => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>
        <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    </div>
);


const CommercialsSection: React.FC = () => {
  return (
    <section id="commercials" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            See Our AI in Action <span className="gradient-text">(in 10 seconds)</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-400">
            Tired of boring software demos? We made these instead.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <VideoCard title="BrainyPOS Commercial" videoId="PxwVR8XCwtY" />
            <VideoCard title="BrainyStooge Commercial" videoId="tY-YNu4GGhs" />
        </div>
      </div>
    </section>
  );
};

export default CommercialsSection;