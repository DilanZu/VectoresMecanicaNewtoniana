document.addEventListener('DOMContentLoaded', () => {
    const inputModeRadiosA = document.getElementsByName('input-mode-a');
    const inputModeRadiosB = document.getElementsByName('input-mode-b');
    const cartesianasInputDivA = document.getElementById('cartesianas-input-a');
    const angulosInputDivA = document.getElementById('angulos-input-a');
    const cartesianasInputDivB = document.getElementById('cartesianas-input-b');
    const angulosInputDivB = document.getElementById('angulos-input-b');

    const axInput = document.getElementById('ax');
    const ayInput = document.getElementById('ay');
    const azInput = document.getElementById('az');
    const bxInput = document.getElementById('bx');
    const byInput = document.getElementById('by');
    const bzInput = document.getElementById('bz');

    const aMagnitudInput = document.getElementById('a-magnitud');
    const aAlphaInput = document.getElementById('a-alpha');
    const aBetaInput = document.getElementById('a-beta');
    const aGammaInput = document.getElementById('a-gamma');
    const aCosGammaNegCheckbox = document.getElementById('a-cos-gamma-neg');
    
    const bMagnitudInput = document.getElementById('b-magnitud');
    const bAlphaInput = document.getElementById('b-alpha');
    const bBetaInput = document.getElementById('b-beta');
    const bGammaInput = document.getElementById('b-gamma');
    const bCosGammaNegCheckbox = document.getElementById('b-cos-gamma-neg');

    const calculateBtn = document.getElementById('calculate-btn');
    const projectionVectorSpan = document.getElementById('projection-vector');
    const projectionMagnitudeSpan = document.getElementById('projection-magnitude');
    const projectionLabel = document.getElementById('projection-label');
    const step1P = document.getElementById('step1');
    const step2P = document.getElementById('step2');
    const step3P = document.getElementById('step3');
    const projectionOrderRadios = document.getElementsByName('projection-order');

    const canvas = document.getElementById('vector-canvas');
    const ctx = canvas.getContext('2d');

    const inputModeRadiosAccel = document.getElementsByName('input-mode-accel');
    const inputModeRadiosVel = document.getElementsByName('input-mode-vel');
    const cartesianasInputDivAccel = document.getElementById('cartesianas-input-accel');
    const angulosInputDivAccel = document.getElementById('angulos-input-accel');
    const cartesianasInputDivVel = document.getElementById('cartesianas-input-vel');
    const angulosInputDivVel = document.getElementById('angulos-input-vel');
    const accelXInput = document.getElementById('accel-x');
    const accelYInput = document.getElementById('accel-y');
    const accelZInput = document.getElementById('accel-z');
    const velXInput = document.getElementById('vel-x');
    const velYInput = document.getElementById('vel-y');
    const velZInput = document.getElementById('vel-z');

    const accelMagnitudInput = document.getElementById('accel-magnitud');
    const accelAlphaInput = document.getElementById('accel-alpha');
    const accelBetaInput = document.getElementById('accel-beta');
    const accelGammaInput = document.getElementById('accel-gamma');
    const accelCosGammaNegCheckbox = document.getElementById('accel-cos-gamma-neg');
    
    const velMagnitudInput = document.getElementById('vel-magnitud');
    const velAlphaInput = document.getElementById('vel-alpha');
    const velBetaInput = document.getElementById('vel-beta');
    const velGammaInput = document.getElementById('vel-gamma');
    const velCosGammaNegCheckbox = document.getElementById('vel-cos-gamma-neg');

    const calculateAccelBtn = document.getElementById('calculate-accel-btn');
    const atVectorSpan = document.getElementById('at-vector');
    const atMagnitudeSpan = document.getElementById('at-magnitude');
    const anVectorSpan = document.getElementById('an-vector');
    const anMagnitudeSpan = document.getElementById('an-magnitude');
    const accelCanvas = document.getElementById('accel-canvas');
    const accelCtx = accelCanvas.getContext('2d');

    function setupEventListeners(radioName, cartesianasDiv, angulosDiv) {
        document.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'cartesianas') {
                    cartesianasDiv.style.display = 'flex';
                    angulosDiv.style.display = 'none';
                } else {
                    cartesianasDiv.style.display = 'none';
                    angulosDiv.style.display = 'flex';
                }
            });
        });
    }

    setupEventListeners('input-mode-a', cartesianasInputDivA, angulosInputDivA);
    setupEventListeners('input-mode-b', cartesianasInputDivB, angulosInputDivB);
    setupEventListeners('input-mode-accel', cartesianasInputDivAccel, angulosInputDivAccel);
    setupEventListeners('input-mode-vel', cartesianasInputDivVel, angulosInputDivVel);

    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    
    function parseValue(value) {
        return value.trim() === '' ? 0 : parseFloat(value);
    }

    function toSignificantFigures(num, sigFigs) {
        if (num === 0) {
            return '0.' + '0'.repeat(sigFigs - 1);
        }
        const n = Math.abs(num);
        const p = Math.ceil(Math.log10(n));
        const factor = Math.pow(10, sigFigs - p);
        const rounded = Math.round(n * factor) / factor;
        return (num < 0 ? '-' : '') + rounded.toFixed(Math.max(0, sigFigs - p));
    }
    
    function calculateVectorFromAngles(magnitude, alpha, beta, gamma, cosGammaNeg) {
        let mag = parseValue(magnitude);
        const al = parseValue(alpha);
        const be = parseValue(beta);
        const gam = parseValue(gamma);
        
        if (isNaN(al) || isNaN(be)) {
            alert('Por favor, ingresa al menos los ángulos α y β.');
            return null;
        }

        if (isNaN(mag)) {
            mag = 1;
        }

        const cosAlpha = Math.cos(toRadians(al));
        const cosBeta = Math.cos(toRadians(be));
        let cosGamma = 0;

        if (!isNaN(gam)) {
            cosGamma = Math.cos(toRadians(gam));
        } else {
            let cosGammaSquared = 1 - cosAlpha * cosAlpha - cosBeta * cosBeta;
            if (cosGammaSquared < 0) {
                alert('La suma de los cuadrados de los cosenos de α y β es mayor que 1. Los ángulos no son directores.');
                return null;
            }
            cosGamma = Math.sqrt(cosGammaSquared) * (cosGammaNeg ? -1 : 1);
        }
        
        return {
            x: mag * cosAlpha,
            y: mag * cosBeta,
            z: mag * cosGamma
        };
    }

    function calculateDynamicScale(vectors, canvasWidth, canvasHeight) {
        let maxComponent = 0;
        vectors.forEach(v => {
            if (v) {
                maxComponent = Math.max(maxComponent, Math.abs(v.x), Math.abs(v.y));
            }
        });
        if (maxComponent === 0) return 1;
        const scale = Math.min(canvasWidth / (2 * maxComponent), canvasHeight / (2 * maxComponent));
        return scale * 0.8; 
    }

    calculateBtn.addEventListener('click', () => {
        let vectorA = {};
        let vectorB = {};
        const modeA = document.querySelector('input[name="input-mode-a"]:checked').value;
        const modeB = document.querySelector('input[name="input-mode-b"]:checked').value;

        if (modeA === 'cartesianas') {
            const ax = parseValue(axInput.value);
            const ay = parseValue(ayInput.value);
            const az = parseValue(azInput.value);
            if (isNaN(ax) || isNaN(ay) || isNaN(az)) {
                alert('Por favor, introduce valores numéricos válidos para el Vector A.');
                return;
            }
            vectorA = {x: ax, y: ay, z: az};
        } else {
            vectorA = calculateVectorFromAngles(
                aMagnitudInput.value,
                aAlphaInput.value,
                aBetaInput.value,
                aGammaInput.value,
                aCosGammaNegCheckbox.checked
            );
            if (!vectorA) return;
        }

        if (modeB === 'cartesianas') {
            const bx = parseValue(bxInput.value);
            const by = parseValue(byInput.value);
            const bz = parseValue(bzInput.value);
            if (isNaN(bx) || isNaN(by) || isNaN(bz)) {
                alert('Por favor, introduce valores numéricos válidos para el Vector B.');
                return;
            }
            vectorB = {x: bx, y: by, z: bz};
        } else {
            vectorB = calculateVectorFromAngles(
                bMagnitudInput.value,
                bAlphaInput.value,
                bBetaInput.value,
                bGammaInput.value,
                bCosGammaNegCheckbox.checked
            );
            if (!vectorB) return;
        }

        let targetVector = null;
        let sourceVector = null;
        let targetLabel = '';
        let sourceLabel = '';

        for (const radio of projectionOrderRadios) {
            if (radio.checked) {
                if (radio.value === 'a_on_b') {
                    sourceVector = vectorA;
                    targetVector = vectorB;
                    sourceLabel = 'A';
                    targetLabel = 'B';
                    projectionLabel.textContent = `Proyección de A sobre B:`;
                } else {
                    sourceVector = vectorB;
                    targetVector = vectorA;
                    sourceLabel = 'B';
                    targetLabel = 'A';
                    projectionLabel.textContent = `Proyección de B sobre A:`;
                }
                break;
            }
        }
        
        const dotProduct = sourceVector.x * targetVector.x + sourceVector.y * targetVector.y + sourceVector.z * targetVector.z;
        const magnitudeTargetSquared = targetVector.x * targetVector.x + targetVector.y * targetVector.y + targetVector.z * targetVector.z;

        if (magnitudeTargetSquared === 0) {
            alert(`El vector ${targetLabel} no puede ser el vector nulo.`);
            return;
        }

        const scalar = dotProduct / magnitudeTargetSquared;

        const projX = scalar * targetVector.x;
        const projY = scalar * targetVector.y;
        const projZ = scalar * targetVector.z;
        
        const projectionMagnitude = Math.sqrt(projX * projX + projY * projY + projZ * projZ);
        
        const sigFigs = 3;
        const formattedProjX = toSignificantFigures(projX, sigFigs);
        const formattedProjY = toSignificantFigures(projY, sigFigs);
        const formattedProjZ = toSignificantFigures(projZ, sigFigs);
        const formattedProjectionMagnitude = toSignificantFigures(projectionMagnitude, sigFigs);

        projectionVectorSpan.textContent = `(${formattedProjX}, ${formattedProjY}, ${formattedProjZ})`;
        projectionMagnitudeSpan.textContent = `${formattedProjectionMagnitude}`;

        const formattedDotProduct = toSignificantFigures(dotProduct, sigFigs);
        const formattedMagnitudeSquared = toSignificantFigures(magnitudeTargetSquared, sigFigs);
        const formattedScalar = toSignificantFigures(scalar, sigFigs);

        step1P.innerHTML = `Paso 1: Calcular el producto punto de ${sourceLabel} y ${targetLabel}.
            $$${sourceLabel} \\cdot ${targetLabel} = (${toSignificantFigures(sourceVector.x, sigFigs)})(${toSignificantFigures(targetVector.x, sigFigs)}) + (${toSignificantFigures(sourceVector.y, sigFigs)})(${toSignificantFigures(targetVector.y, sigFigs)}) + (${toSignificantFigures(sourceVector.z, sigFigs)})(${toSignificantFigures(targetVector.z, sigFigs)}) = ${formattedDotProduct}$$`;
        
        step2P.innerHTML = `Paso 2: Calcular la magnitud al cuadrado del vector ${targetLabel}.
            $$||${targetLabel}||^2 = (${toSignificantFigures(targetVector.x, sigFigs)})^2 + (${toSignificantFigures(targetVector.y, sigFigs)})^2 + (${toSignificantFigures(targetVector.z, sigFigs)})^2 = ${formattedMagnitudeSquared}$$`;

        step3P.innerHTML = `Paso 3: Usar la fórmula para encontrar las coordenadas de la proyección.
            $$\\text{proy}_{${targetLabel}}{${sourceLabel}} = \\left(\\frac{${sourceLabel} \\cdot ${targetVector}}{||${targetVector}||^2}\\right) \\cdot ${targetVector} = \\left(\\frac{${formattedDotProduct}}{${formattedMagnitudeSquared}}\\right) \\cdot (${toSignificantFigures(targetVector.x, sigFigs)}, ${toSignificantFigures(targetVector.y, sigFigs)}, ${toSignificantFigures(targetVector.z, sigFigs)}) = (${formattedProjX}, ${formattedProjY}, ${formattedProjZ})$$`;

        MathJax.typeset();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX, centerY);

        const scale = calculateDynamicScale([vectorA, vectorB], canvas.width, canvas.height);
        
        drawAxes(ctx, canvas);
        drawVector(ctx, 0, 0, vectorA.x * scale, -vectorA.y * scale, 'blue', 'Vector A');
        drawVector(ctx, 0, 0, vectorB.x * scale, -vectorB.y * scale, 'red', 'Vector B');
        drawVector(ctx, 0, 0, projX * scale, -projY * scale, 'green', 'Proyección');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    calculateAccelBtn.addEventListener('click', () => {
        let vectorA = {};
        let vectorV = {};
        const modeA = document.querySelector('input[name="input-mode-accel"]:checked').value;
        const modeV = document.querySelector('input[name="input-mode-vel"]:checked').value;
        
        if (modeA === 'cartesianas') {
            const ax = parseValue(accelXInput.value);
            const ay = parseValue(accelYInput.value);
            const az = parseValue(accelZInput.value);
            if (isNaN(ax) || isNaN(ay) || isNaN(az)) {
                alert('Por favor, introduce valores numéricos válidos para la Aceleración (A).');
                return;
            }
            vectorA = {x: ax, y: ay, z: az};
        } else {
            vectorA = calculateVectorFromAngles(
                accelMagnitudInput.value,
                accelAlphaInput.value,
                accelBetaInput.value,
                accelGammaInput.value,
                accelCosGammaNegCheckbox.checked
            );
            if (!vectorA) return;
        }
        
        if (modeV === 'cartesianas') {
            const vx = parseValue(velXInput.value);
            const vy = parseValue(velYInput.value);
            const vz = parseValue(velZInput.value);
            if (isNaN(vx) || isNaN(vy) || isNaN(vz)) {
                alert('Por favor, introduce valores numéricos válidos para la Velocidad (V).');
                return;
            }
            vectorV = {x: vx, y: vy, z: vz};
        } else {
            vectorV = calculateVectorFromAngles(
                velMagnitudInput.value,
                velAlphaInput.value,
                velBetaInput.value,
                velGammaInput.value,
                velCosGammaNegCheckbox.checked
            );
            if (!vectorV) return;
        }

        const dotProduct = vectorA.x * vectorV.x + vectorA.y * vectorV.y + vectorA.z * vectorV.z;
        const magnitudeVSquared = vectorV.x * vectorV.x + vectorV.y * vectorV.y + vectorV.z * vectorV.z;

        if (magnitudeVSquared === 0) {
            alert('El vector de velocidad no puede ser el vector nulo.');
            return;
        }

        const scalar = dotProduct / magnitudeVSquared;

        const atX = scalar * vectorV.x;
        const atY = scalar * vectorV.y;
        const atZ = scalar * vectorV.z;

        const anX = vectorA.x - atX;
        const anY = vectorA.y - atY;
        const anZ = vectorA.z - atZ;

        const atMagnitude = Math.sqrt(atX * atX + atY * atY + atZ * atZ);
        const anMagnitude = Math.sqrt(anX * anX + anY * anY + anZ * anZ);
        
        const sigFigs = 3;
        atVectorSpan.textContent = `(${toSignificantFigures(atX, sigFigs)}, ${toSignificantFigures(atY, sigFigs)}, ${toSignificantFigures(atZ, sigFigs)})`;
        atMagnitudeSpan.textContent = `${toSignificantFigures(atMagnitude, sigFigs)}`;
        anVectorSpan.textContent = `(${toSignificantFigures(anX, sigFigs)}, ${toSignificantFigures(anY, sigFigs)}, ${toSignificantFigures(anZ, sigFigs)})`;
        anMagnitudeSpan.textContent = `${toSignificantFigures(anMagnitude, sigFigs)}`;

        MathJax.typeset();
        
        accelCtx.clearRect(0, 0, accelCanvas.width, accelCanvas.height);
        const centerX = accelCanvas.width / 2;
        const centerY = accelCanvas.height / 2;
        accelCtx.translate(centerX, centerY);

        const scale = calculateDynamicScale([vectorA, vectorV, {x: atX, y: atY, z: atZ}, {x: anX, y: anY, z: anZ}], accelCanvas.width, accelCanvas.height);

        drawAxes(accelCtx, accelCanvas);
        drawVector(accelCtx, 0, 0, vectorA.x * scale, -vectorA.y * scale, 'blue', 'Vector A');
        drawVector(accelCtx, 0, 0, vectorV.x * scale, -vectorV.y * scale, 'red', 'Vector V');
        drawVector(accelCtx, 0, 0, atX * scale, -atY * scale, 'green', 'Vector at');
        drawVector(accelCtx, atX * scale, -atY * scale, anX * scale, -anY * scale, 'purple', 'Vector an');
        accelCtx.setTransform(1, 0, 0, 1, 0, 0);
    });

    function drawVector(ctx, x1, y1, x2, y2, color, label) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 10 * Math.cos(angle - Math.PI / 6), y2 - 10 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 10 * Math.cos(angle + Math.PI / 6), y2 - 10 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = '12px Arial';
        ctx.fillText(label, x2 + 15 * Math.cos(angle), y2 + 15 * Math.sin(angle));
    }

    function drawAxes(ctx, canvas) {
        ctx.strokeStyle = '#ced4da';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(-canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -canvas.height / 2);
        ctx.lineTo(0, canvas.height / 2);
        ctx.stroke();
    }
});
