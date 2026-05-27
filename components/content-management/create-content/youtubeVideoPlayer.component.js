import React from 'react';
import YouTube from 'react-youtube';

const YouTubeVideo = ({ videoId }) => {

    function isYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+/i;
        const shortYoutubeRegex = /^(https?:\/\/)?(www\.)?youtu\.be\/.+/i;
        return youtubeRegex.test(url) || shortYoutubeRegex.test(url);
    }

    function extractVideoIdFromUrl(url) {
        const urlObj = new URL(url);
        const searchParams = urlObj.searchParams;
        let videoId = searchParams.get('v');
        if (!videoId) {
            const regex = /[?&]v=([^&]+)/;
            const match = url.match(regex);
            videoId = match && match[1];
        }
        return videoId || null;
    }

    
    const opts = {
        height: '190',
        width: '340',
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <>
            {isYouTubeUrl(videoId) ?
                <YouTube videoId={extractVideoIdFromUrl(videoId)} opts={opts} /> : <iframe src={videoId}></iframe>}
        </>
    );
};

export default YouTubeVideo;
