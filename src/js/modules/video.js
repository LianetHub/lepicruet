export class Video {
    constructor() {
        this.video = document.querySelector('.production__video');
        this.playBtn = document.querySelector('.production__video-btn');
        this.poster = document.querySelector('.production__video-poster');
        this.init();
    }

    init() {
        let videoHref = this.video.getAttribute('data-video');
        let deletedLength = 'https://youtu.be/'.length;
        let videoId = videoHref.substring(deletedLength, videoHref.length);

        // let img = this.video.querySelector('img');
        // let youtubeImgSrc = 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg';

        this.playBtn.addEventListener('click', (e) => {
            e.preventDefault();

            let iframe = this.createIframe(videoId);
            this.poster.remove();
            this.video.appendChild(iframe);
            this.playBtn.remove();
        });
    }

    generateUrl(id) {
        let query = '?rel=0&showinfo=0&autoplay=1';
        return 'https://www.youtube.com/embed/' + id + query;
    };

    createIframe(id) {
        let iframe = document.createElement('iframe');

        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('src', this.generateUrl(id));

        return iframe;
    };





}