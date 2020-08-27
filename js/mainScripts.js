$ (document).ready (function () {
  const svg = () => {
    const svgEl = document.createElementNS (
      'http://www.w3.org/2000/svg',
      'svg'
    );

    const svgWidth = 600;
    const svgHeight = 600;
    let balloonsPopped = 0;

    svgEl.setAttribute ('width', svgWidth);
    svgEl.setAttribute ('height', svgHeight);
    svgEl.setAttribute ('style', 'border: 8px solid lightblue');

    for (let i = 0; i < 14; i++) {
      const yOffsetBottom = svgHeight + 150;
      const yOffsetTop = -150;
      const animateMotion = document.createElementNS (
        'http://www.w3.org/2000/svg',
        'animate'
      );
      animateMotion.setAttribute ('attributeName', 'cy');

      animateMotion.setAttribute ('attributeType', 'XML');
      animateMotion.setAttribute ('from', yOffsetBottom);
      animateMotion.setAttribute ('to', yOffsetTop);
      animateMotion.setAttribute ('begin', `${i}s`);
      animateMotion.setAttribute ('dur', '10s');

      animateMotion.setAttribute ('repeatCount', 'indefinite');

      const color = getRandomColor ();
      const balloon = document.createElementNS (
        'http://www.w3.org/2000/svg',
        'svg'
      );

      const ellipse = document.createElementNS (
        'http://www.w3.org/2000/svg',
        'ellipse'
      );

      const radiusX = getRandomRadius ();
      const radiusY = radiusX * 1.2;

      const xPos = getRandomPosition (radiusX, svgWidth);

      ellipse.setAttribute ('cx', xPos);
      ellipse.setAttribute ('cy', yOffsetBottom);
      ellipse.setAttribute ('rx', radiusX);
      ellipse.setAttribute ('ry', radiusY);
      ellipse.setAttribute ('style', `fill:${color}`);

      balloon.appendChild (ellipse);

      ellipse.appendChild (animateMotion);

      const polygon = document.createElementNS (
        'http://www.w3.org/2000/svg',
        'polygon'
      );

      const centerToTriangleTop = getDistanceFromCenterToTriangleTop (radiusY);
      const triangleTopY = yOffsetBottom + centerToTriangleTop;
      const triangleDimensions = getTriangleDimensions (radiusY);
      const triangleWidth = triangleDimensions[0];
      const triangleHeight = triangleDimensions[1];

      polygon.setAttribute (
        'points',
        `${xPos},${triangleTopY} ${xPos - triangleWidth}, ${triangleTopY + triangleHeight} ${xPos + triangleWidth}, ${triangleTopY + triangleHeight}`
      );
      polygon.setAttribute ('style', `fill:${color}`);

      balloon.appendChild (polygon);

      const animateTriangle = animateMotion.cloneNode (true);
      animateTriangle.setAttribute ('attributeName', 'points');
      animateTriangle.setAttribute (
        'from',
        `${xPos},${triangleTopY} ${xPos - triangleWidth}, ${triangleTopY + triangleHeight} ${xPos + triangleWidth}, ${triangleTopY + triangleHeight}`
      );
      animateTriangle.setAttribute (
        'to',
        `${xPos},${centerToTriangleTop + yOffsetTop} ${xPos - triangleWidth}, ${centerToTriangleTop + triangleHeight + yOffsetTop} ${xPos + triangleWidth}, ${centerToTriangleTop + triangleHeight + yOffsetTop}`
      );
      polygon.appendChild (animateTriangle);

      const rect = document.createElementNS (
        'http://www.w3.org/2000/svg',
        'rect'
      );

      const rectDimensions = getRectDimensions (triangleHeight, triangleWidth);
      const rectHeight = rectDimensions[0];
      const rectWidth = rectDimensions[1];

      rect.setAttribute ('x', xPos - rectWidth);
      rect.setAttribute ('y', yOffsetBottom);
      rect.setAttribute ('height', rectHeight);
      rect.setAttribute ('width', rectWidth * 2);
      rect.setAttribute ('style', `fill:#FFFFFF`);

      balloon.appendChild (rect);

      const animateRect = animateMotion.cloneNode (true);
      animateRect.setAttribute ('attributeName', 'y');
      animateRect.setAttribute (
        'from',
        yOffsetBottom + centerToTriangleTop + triangleHeight
      );
      animateRect.setAttribute (
        'to',
        triangleHeight + centerToTriangleTop + yOffsetTop
      );

      rect.appendChild (animateRect);

      balloon.onmouseover = function (e) {
        console.log ('onMouseover');
        e.srcElement.parentElement.style.strokeWidth = 2;
        e.srcElement.parentElement.style.stroke = '#FFFFFFE1';
        e.srcElement.parentElement.style.cursor = 'pointer';
      };

      balloon.onmouseout = function (e) {
        console.log ('onMouseout');
        e.srcElement.parentElement.style.stroke = 'none';
      };

      balloon.onclick = function (e) {
        console.log (e);
        e.srcElement.parentElement.style.display = 'none';
        balloonsPopped += 1;
        updateSVGData (balloonsPopped);
      };

      svgEl.appendChild (balloon);
    }

    function updateSVGData (balloonsPopped) {
      document.getElementById ('svgData').innerHTML = balloonsPopped;
    }

    const svgCont = document.getElementById ('svgContainer');
    svgCont.appendChild (svgEl);
  };

  const canvas = () => {
    var canvas = document.getElementById ('myCanvas');
    var ctx = canvas.getContext ('2d');
    ctx.globalCompositeOperation = 'source-over';

    let balloonsAmount = 8;
    updateCanvasData (balloonsAmount);
    drawElements (ctx, canvas);

    function drawElements (ctx) {
      for (let i = 0; i < balloonsAmount; i++) {
        createRandomBallon (ctx);
      }
    }

    function createRandomBallon (ctx) {
      const radiusX = getRandomRadius ();
      const xPos = getRandomPosition (radiusX, canvas.width);
      const yPos = getRandomPosition (radiusX, canvas.height);
      drawBallon (ctx, xPos, yPos, radiusX);
    }

    function drawBallon (ctx, xPos, yPos, radiusX) {
      const color = getRandomColor ();
      ctx.beginPath ();
      ctx.fillStyle = color;

      const radiusY = radiusX * 1.2;

      ctx.ellipse (xPos, yPos, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.fill ();
      ctx.closePath ();

      const yEllipseBottom = getYEllipseBottom (yPos, radiusY);
      const triangleDimensions = getTriangleDimensions (radiusY);
      const triangleWidth = triangleDimensions[0];
      const triangleHeight = triangleDimensions[1];

      ctx.beginPath ();
      ctx.moveTo (xPos, yEllipseBottom);
      ctx.lineTo (xPos - triangleWidth, yEllipseBottom + triangleHeight);
      ctx.lineTo (xPos + triangleWidth, yEllipseBottom + triangleHeight);
      ctx.fill ();
      ctx.closePath ();

      const rectDimensions = getRectDimensions (triangleHeight, triangleWidth);
      const rectHeight = rectDimensions[0];
      const rectWidth = rectDimensions[1];

      ctx.beginPath ();
      ctx.fillStyle = '#FFFFFF';
      ctx.moveTo (xPos - rectWidth, yEllipseBottom + triangleHeight);
      ctx.lineTo (
        xPos - rectWidth,
        yEllipseBottom + triangleHeight + rectHeight
      );
      ctx.lineTo (
        xPos + rectWidth,
        yEllipseBottom + triangleHeight + rectHeight
      );
      ctx.lineTo (xPos + rectWidth, yEllipseBottom + triangleHeight);
      ctx.fill ();
      ctx.closePath ();
    }

    canvas.addEventListener ('click', function (e) {
      const mousePosition = getMousePosition (canvas, e);
      const xMouse = mousePosition[0];
      const yMouse = mousePosition[1];

      const radius = getRandomRadius ();
      drawBallon (ctx, xMouse, yMouse, radius);

      balloonsAmount += 1;
      updateCanvasData (balloonsAmount);
    });
  };

  function updateCanvasData (balloonsAmount) {
    console.log ('updateCa', balloonsAmount);
    document.getElementById ('canvasData').innerHTML = balloonsAmount;
  }

  function getMousePosition (canvas, event) {
    let rect = canvas.getBoundingClientRect ();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x, y];
  }
  function getRandomRadius () {
    return 20 + Math.floor (Math.random () * 60);
  }

  const opacityValuesList = ['FF', 'F5', 'F2'];
  const elementColorsList = [
    '#884260',
    '#aa5378',
    '#763a54',
    '#aa5378',
    '#b26485',
    '#bb7593',
    '#c386a0',
    '#cc97ae',
  ];

  function getRandomColor () {
    const opacity =
      opacityValuesList[Math.floor (Math.random () * opacityValuesList.length)];
    const base =
      elementColorsList[Math.floor (Math.random () * elementColorsList.length)];
    const color = base + opacity;
    return color;
  }

  function getRandomPosition (radius, range) {
    return radius + Math.floor (Math.random () * (range - 2 * radius));
  }

  function getYEllipseBottom (y, radiusY) {
    return y + getDistanceFromCenterToTriangleTop (radiusY);
  }

  function getDistanceFromCenterToTriangleTop (radiusY) {
    return radiusY - radiusY * 0.2;
  }

  function getTriangleDimensions (radiusY) {
    const triangleWidth = radiusY / 6;
    const triangleHeight = triangleWidth * 2;
    return [triangleWidth, triangleHeight];
  }
  function getRectDimensions (triangleHeight, triangleWidth) {
    const rectHeight = triangleHeight * 2;
    const rectWidth = triangleWidth / 6;
    return [rectHeight, rectWidth];
  }

  svg ();
  canvas ();
});
