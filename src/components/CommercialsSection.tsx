import React from 'react';

const VideoCard = ({ title, videoSrc }: { title: string, videoSrc: string }) => (
    <div>
        <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>
        <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <video
                className="w-full h-full"
                src={videoSrc}
                title={title}
                controls
            ></video>
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
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <VideoCard title="BrainyPOS Commercial" videoSrc="/videos/brainy_pos_ad.mp4" />
            <VideoCard title="BrainyStooge Commercial" videoSrc="/videos/brainy_stooge_ad.mp4" />
            <VideoCard title="BrainyStooge Demo" videoSrc="/videos/BrainyStoogeDemo.mp4" />
        </div>
      </div>
    </section>
  );
};

export default CommercialsSection;