navigator.xr.addEventListener('devicechange', async () => {
  const device = await navigator.xr.requestDevice();
  await device.supportsSession({
    exclusive: true,
  });

  const canvas = document.createElement('canvas');
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

  const drawFrame = (timestamp, frame) => {
    let pose = frame.getDevicePose(frameOfReference);
    console.log(pose);

    session.requestAnimationFrame(drawFrame);
  };

  session.requestAnimationFrame(drawFrame);
});
