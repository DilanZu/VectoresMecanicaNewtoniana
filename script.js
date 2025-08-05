body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #e9ecef;
    color: #495057;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.6;
}

header, main, footer {
    width: 90%;
    max-width: 900px;
    margin: 20px 0;
    text-align: center;
}

h1 {
    color: #212529;
    font-weight: 600;
}

h2 {
    color: #212529;
    font-weight: 600;
    margin-top: 40px;
}

p {
    color: #6c757d;
}

.input-section, .output-section {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.input-mode-selector {
    margin-bottom: 10px;
}

.input-mode-selector label {
    margin: 0 5px;
    cursor: pointer;
    font-weight: 500;
}

.vector-input-group {
    display: flex;
    flex-direction: column;
    margin: 15px;
    padding: 20px;
    border: 1px solid #000913;
    border-radius: 8px;
    flex: 1;
    min-width: 250px;
}

.vector-input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.vector-input-header h3 {
    margin: 0;
    color: #007bff;
}

.vector-input {
    display: flex;
    flex-direction: column;
}

.vector-input label {
    margin-top: 10px;
    font-weight: 500;
}

.vector-input input:not([type='radio']):not([type='checkbox']) {
    padding: 10px;
    border: 1px solid #454b52;
    border-radius: 6px;
    margin-top: 5px;
    transition: border-color 0.3s;
}

.vector-input input:not([type='radio']):not([type='checkbox']):focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.checkbox-label {
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-weight: 400;
}

.checkbox-label input:not([type='radio']) {
    margin-right: 5px;
}

.projection-choice {
    width: 100%;
    margin-top: 20px;
    background-color: #b3d8fd;
    padding: 10px 20px;
    border-radius: 8px;
}

.projection-choice h3 {
    margin: 0 0 10px 0;
}

.projection-choice label {
    margin: 0 10px;
}

#calculate-btn, #calculate-accel-btn {
    padding: 12px 25px;
    color: #181818;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 30px;
    transition: background-color 0.3s, transform 0.2s;
}

#calculate-btn {
    background-color: #6aa6e7;
}

#calculate-btn:hover {
    background-color: #3c6cc5;
    transform: translateY(-2px);
}

#calculate-accel-btn {
    background-color: #28a745;
}

#calculate-accel-btn:hover {
    background-color: #218838;
    transform: translateY(-2px);
}

#results, #accel-results {
    text-align: left;
    width: 100%;
}

#calculation-process {
    background-color: #fcfcfc;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
}

#calculation-process h4 {
    margin-top: 0;
    color: #343a40;
}

.visualization-container {
    border: 1px solid #000000;
    border-radius: 8px;
    background-color: #ffffff;
    margin-top: 20px;
}

#vector-canvas, #accel-canvas {
    display: block;
}
.hover-info {
    cursor: help;
}

.gamma-input-group {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.gamma-input-group input[type="number"] {
    margin-top: 5px;
}

.trig-mode-selector {
    margin-top: 10px;
}

.trig-mode-selector label {
    margin-right: 15px;
}

/* NUEVA SECCIÓN: Estilos para pantallas pequeñas (móviles) */
@media (max-width: 600px) {
    .input-section {
        flex-direction: column;
        padding: 15px;
    }
    
    .vector-input-group {
        width: 100%;
        margin: 10px 0;
    }

    .input-mode-selector {
        align-self: flex-start;
        margin-top: 10px;
    }

    #calculate-btn, #calculate-accel-btn {
        width: 100%;
    }
}
