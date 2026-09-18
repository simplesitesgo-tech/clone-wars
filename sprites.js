(function () {
  function drawBackground(ctx, width, height, time) {
    ctx.save();

    const horizon = height * 0.61;
    const skyGradient = ctx.createLinearGradient(0, 0, 0, horizon);
    skyGradient.addColorStop(0, '#4db7f2');
    skyGradient.addColorStop(1, '#b9ecff');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, horizon);

    // Soft clouds keep the sky lively without hiding the obstacles.
    const drift = ((time || 0) * 8) % (width + 90);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.66)';
    for (let i = 0; i < 3; i += 1) {
      const cloudX = ((i * 151 - drift + width + 90) % (width + 90)) - 45;
      const cloudY = 72 + i * 47;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY + 8, 17, Math.PI, 0);
      ctx.arc(cloudX + 18, cloudY, 22, Math.PI, 0);
      ctx.arc(cloudX + 42, cloudY + 9, 15, Math.PI, 0);
      ctx.lineTo(cloudX + 57, cloudY + 19);
      ctx.lineTo(cloudX - 6, cloudY + 19);
      ctx.closePath();
      ctx.fill();
    }

    // Distant stadium roof and upper stands.
    ctx.fillStyle = '#25466d';
    ctx.beginPath();
    ctx.moveTo(0, horizon - 66);
    ctx.quadraticCurveTo(width * 0.5, horizon - 126, width, horizon - 66);
    ctx.lineTo(width, horizon - 28);
    ctx.lineTo(0, horizon - 28);
    ctx.closePath();
    ctx.fill();

    // Packed crowd silhouettes, with repeating color blocks.
    const crowdTop = horizon - 54;
    const crowdBottom = horizon - 4;
    ctx.fillStyle = '#17283c';
    ctx.fillRect(0, crowdTop, width, crowdBottom - crowdTop);
    const crowdColors = ['#ef476f', '#ffd166', '#06d6a0', '#f7f7f7', '#8d99ae'];
    for (let i = -1; i < Math.ceil(width / 17) + 1; i += 1) {
      const px = i * 17 + 4;
      const headY = crowdTop + 10 + ((i * 7) % 8 + 8) % 8;
      ctx.fillStyle = crowdColors[(i + 20) % crowdColors.length];
      ctx.beginPath();
      ctx.arc(px, headY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(px - 5, headY + 5, 10, crowdBottom - headY - 6);
    }

    // Colorful tournament banners.
    const bannerY = crowdTop - 5;
    const bannerColors = ['#f94144', '#f9c74f', '#43aa8b', '#577590', '#f9844a'];
    for (let i = 0; i < 8; i += 1) {
      const bx = 12 + i * (width / 7.3);
      ctx.fillStyle = '#f8f5e7';
      ctx.fillRect(bx, bannerY - 13, 2, 30);
      ctx.fillStyle = bannerColors[i % bannerColors.length];
      ctx.beginPath();
      ctx.moveTo(bx + 2, bannerY - 12);
      ctx.lineTo(bx + 22, bannerY - 5);
      ctx.lineTo(bx + 2, bannerY + 3);
      ctx.closePath();
      ctx.fill();
    }

    // Confetti is deterministic so the still frame is complete at time 0.
    const confetti = [
      [0.12, 0.12, '#f94144', 0.3], [0.28, 0.2, '#ffd166', -0.2],
      [0.48, 0.11, '#06d6a0', 0.4], [0.7, 0.26, '#f3722c', -0.3],
      [0.88, 0.13, '#8338ec', 0.2], [0.38, 0.34, '#ef476f', -0.4],
      [0.82, 0.41, '#118ab2', 0.3]
    ];
    for (let i = 0; i < confetti.length; i += 1) {
      const piece = confetti[i];
      const px = piece[0] * width + Math.sin((time || 0) + i) * 3;
      const py = piece[1] * horizon + Math.cos((time || 0) * 0.8 + i) * 2;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(piece[3]);
      ctx.fillStyle = piece[2];
      ctx.fillRect(-3, -7, 6, 14);
      ctx.restore();
    }

    // The lower rail separates the stands from the pitch.
    ctx.fillStyle = '#f4f1de';
    ctx.fillRect(0, horizon - 5, width, 6);
    ctx.fillStyle = '#314e3c';
    ctx.fillRect(0, horizon + 1, width, height - horizon - 1);

    ctx.restore();
  }

  function drawGround(ctx, width, height, groundHeight, offset) {
    ctx.save();

    const top = height - groundHeight;
    ctx.fillStyle = '#25834a';
    ctx.fillRect(0, top, width, groundHeight);
    ctx.fillStyle = '#39a85b';
    ctx.fillRect(0, top, width, 8);

    // Alternating mowing stripes slide with the ground offset.
    const stripeWidth = 42;
    const shift = ((offset || 0) % (stripeWidth * 2)) - stripeWidth * 2;
    for (let x = shift; x < width + stripeWidth * 2; x += stripeWidth * 2) {
      ctx.fillStyle = 'rgba(163, 226, 116, 0.22)';
      ctx.fillRect(x, top + 8, stripeWidth, groundHeight - 8);
    }

    ctx.fillStyle = '#f7f4dc';
    ctx.fillRect(0, top + 8, width, 3);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.68)';
    ctx.lineWidth = 3;
    const center = width / 2 - ((offset || 0) * 0.25 % width);
    ctx.beginPath();
    ctx.moveTo(center, top + 11);
    ctx.lineTo(center, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(center, top + groundHeight * 0.56, 25, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawBird(ctx, x, y, size, velocity) {
    ctx.save();
    const radius = size * 0.35;
    const tilt = Math.max(-0.3, Math.min(0.35, (velocity || 0) / 900));
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Short golden motion trail remains inside the character box.
    ctx.strokeStyle = '#8a5a00';
    ctx.lineWidth = Math.max(2, size * 0.08);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size * 0.38, size * 0.08);
    ctx.lineTo(-size * 0.48, size * 0.14);
    ctx.moveTo(-size * 0.39, size * 0.2);
    ctx.lineTo(-size * 0.47, size * 0.27);
    ctx.stroke();
    ctx.strokeStyle = '#f4b942';
    ctx.lineWidth = Math.max(2, size * 0.045);
    ctx.beginPath();
    ctx.moveTo(-size * 0.38, size * 0.08);
    ctx.lineTo(-size * 0.47, size * 0.14);
    ctx.moveTo(-size * 0.39, size * 0.2);
    ctx.lineTo(-size * 0.46, size * 0.27);
    ctx.stroke();

    // Soccer ball with a dark outline and simple pentagon-like panels.
    ctx.fillStyle = '#101820';
    ctx.beginPath();
    ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8f7f0';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#171c22';
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.56);
    ctx.lineTo(radius * 0.53, -radius * 0.17);
    ctx.lineTo(radius * 0.33, radius * 0.48);
    ctx.lineTo(-radius * 0.33, radius * 0.48);
    ctx.lineTo(-radius * 0.53, -radius * 0.17);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f8f7f0';
    ctx.lineWidth = Math.max(1.5, size * 0.035);
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.56);
    ctx.lineTo(0, -radius * 0.9);
    ctx.moveTo(radius * 0.53, -radius * 0.17);
    ctx.lineTo(radius * 0.86, -radius * 0.3);
    ctx.moveTo(radius * 0.33, radius * 0.48);
    ctx.lineTo(radius * 0.55, radius * 0.78);
    ctx.moveTo(-radius * 0.33, radius * 0.48);
    ctx.lineTo(-radius * 0.55, radius * 0.78);
    ctx.moveTo(-radius * 0.53, -radius * 0.17);
    ctx.lineTo(-radius * 0.86, -radius * 0.3);
    ctx.stroke();

    ctx.restore();
  }

  function drawPipe(ctx, x, gapTop, gapBottom, pipeWidth, height) {
    ctx.save();
    const outline = '#17212b';
    const gold = '#f2b134';
    const lightGold = '#ffe08a';
    const blue = '#2d7dd2';

    function goalSection(top, sectionHeight, isTop) {
      if (sectionHeight <= 0) return;
      // Full-height fill is kept exactly inside the collision rectangle.
      ctx.fillStyle = gold;
      ctx.fillRect(x, top, pipeWidth, sectionHeight);
      // Inset border avoids drawing into the open gap.
      ctx.fillStyle = outline;
      ctx.fillRect(x, top, pipeWidth, Math.min(3, sectionHeight));
      ctx.fillRect(x, top + Math.max(0, sectionHeight - 3), pipeWidth, Math.min(3, sectionHeight));
      ctx.fillRect(x, top, Math.min(3, pipeWidth), sectionHeight);
      ctx.fillRect(x + Math.max(0, pipeWidth - 3), top, Math.min(3, pipeWidth), sectionHeight);

      const postWidth = Math.max(8, pipeWidth * 0.18);
      const postX = x + pipeWidth * 0.4;
      ctx.fillStyle = lightGold;
      ctx.fillRect(postX, top + 3, postWidth, Math.max(0, sectionHeight - 6));
      ctx.fillStyle = blue;
      ctx.fillRect(postX + 2, top + 3, Math.max(2, postWidth * 0.28), Math.max(0, sectionHeight - 6));

      // Goal crossbar cap, entirely within its section.
      const capHeight = Math.min(18, sectionHeight);
      const capY = isTop ? top + sectionHeight - capHeight : top;
      ctx.fillStyle = outline;
      ctx.fillRect(x, capY, pipeWidth, capHeight);
      ctx.fillStyle = gold;
      ctx.fillRect(x + 3, capY + 3, Math.max(0, pipeWidth - 6), Math.max(0, capHeight - 6));
      ctx.fillStyle = lightGold;
      ctx.fillRect(x + 6, capY + 5, Math.max(0, pipeWidth - 12), 4);
    }

    goalSection(0, gapTop, true);
    goalSection(gapBottom, height - gapBottom, false);
    ctx.restore();
  }

  window.SPRITES = {
    drawBackground: drawBackground,
    drawGround: drawGround,
    drawBird: drawBird,
    drawPipe: drawPipe
  };
})();
