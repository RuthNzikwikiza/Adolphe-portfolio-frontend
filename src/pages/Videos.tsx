import { getVideos } from '../api';
import { toParagraphs } from '../text';
import { useFetch } from '../useFetch';

export default function Videos() {
  const { data: videos, error } = useFetch(getVideos);

  if (error) return <p role="alert">{error}</p>;
  if (!videos) return <p>Loading...</p>;

  const playable = videos.filter((video) => video.video_id !== '');

  return (
    <section className="videos">
      <h1>Videos</h1>
      <p>Watch videos from YouTube.</p>

      {playable.length === 0 ? (
        <p>No videos have been added yet.</p>
      ) : (
        <ul className="videos-grid">
          {playable.map((video) => (
            <li key={video.id}>
              <div className="video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.video_id}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <h2>{video.title}</h2>
              {toParagraphs(video.description).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
