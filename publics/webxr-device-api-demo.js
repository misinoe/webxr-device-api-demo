navigator.xr.addEventListener('devicechange', async () => {
  const device = await navigator.xr.requestDevice();
  await device.supportsSession({
    exclusive: true,
  });

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const context = canvas.getContext('webgl');

  await new Promise(resolve => {
    const div = document.createElement('div');
    div.innerText = 'Tap Me!';
    document.body.appendChild(div);
    const clickHandler = () => {
      document.body.removeChild(div);
      window.removeEventListener('click', clickHandler);
      resolve();
    };
    window.addEventListener('click', clickHandler);
  });

  const session = await device.requestSession({
    exclusive: true,
  });

  const frameOfReference = await session.requestFrameOfReference('headModel');

  await context.setCompatibleXRDevice(device);
  session.baseLayer = new XRWebGLLayer(session, context);

  const drawScene = (view, pose) => {
    console.log('draw');
  };

  const drawFrame = (timestamp, frame) => {
    const pose = frame.getDevicePose(frameOfReference);

    const {baseLayer} = session;
    for (let view of frame.views) {
      const {x, y, width, height} = baseLayer.getViewport(view);
      context.viewport(x, y, width, height);
      drawScene(view, pose);
    }

    session.requestAnimationFrame(drawFrame);
  };

  session.requestAnimationFrame(drawFrame);
});
