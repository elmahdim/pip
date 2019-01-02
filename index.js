document.addEventListener('DOMContentLoaded', () => {
  let stream;
  const mediaTypes = document.typeSwicther;
  const videoEl = document.querySelector('video');
  const pipButton = document.getElementById('pip');
  const playButton = document.getElementById('play');
  const resetButton = document.getElementById('reset');
  const controlBar = document.querySelector('.control-bar');


  const initialize = async (demo) => {
    if (demo === 'local-stream' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoEl.srcObject = stream;
      videoEl.play();
    } else {
      videoEl.src = 'assets/View_of_Earth_at_Night_from_Space.mp4';
    }
  }

  const handleListeners = (event) => {
    const { target, type } = event;
    target.removeEventListener(type, handleListeners);
    type === 'ended' && controlBar.classList.remove('is-playing');
    console.log('event type:', type);
  };

  const reset = () => {
    videoEl.src = '';
    mediaTypes.reset();
    document.body.removeAttribute('class');

    if (stream) {
      videoEl.srcObject = null;
      stream.getVideoTracks()[0].stop();
      stream = null;
    };
  };

  [...mediaTypes.demoType].forEach(input => input.addEventListener('change', (event) => {
    document.body.classList.add('is-active', event.target.value);
    initialize(event.target.value);
  }));

  resetButton.addEventListener('click', reset);

  playButton.addEventListener('click', () => {
    const isPaused = videoEl.paused;
    isPaused ? videoEl.play() :  videoEl.pause();
    controlBar.classList.toggle('is-playing', isPaused);
    videoEl.addEventListener('ended', handleListeners);
  });

  pipButton.addEventListener('click', () => {
    try {
      if (videoEl !== document.pictureInPictureElement) {
        videoEl.requestPictureInPicture();
      } else {
        document.exitPictureInPicture();
      }
    } catch(error) {
      console.error(error)
    }
  });

  videoEl.addEventListener('enterpictureinpicture', handleListeners);
  videoEl.addEventListener('leavepictureinpicture', handleListeners);
  videoEl.addEventListener('resize', handleListeners);
});