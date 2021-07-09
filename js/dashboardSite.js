function getDashboardHtml(rooms, lights) {
  let html = `<div class="col-md-4">
  <div class="h-100 p-4 text-white bg-dark border rounded-3">
    <h1 class="display-8">Rooms
      <button id="refreshBtn" class="btn btn-secondary btn-refresh">Refresh</button>
    </h1>
    <div id="roomSelecters">`;

  let bottomDivs = `</div></div></div> <div class="col-md-8 "><div class="h-100 p-3 text-white bg-dark border rounded-3 d-flex align-content-start flex-wrap" id="lightSelecters">`;
  let bottomHtml = "</div>";

  for (const room of rooms) {
    html += makeRoomSelecter(room.name, room.on, room.id, room.xy, room.ct, room.bri);
  }
  html += bottomDivs;
  for (const light of lights) {
    if (allRoom[String(selectedRoomID)].lightsInRoom.includes(String(light.id)))
      html += makeLightSelecter(light);
  }
  html += bottomHtml;
  return html;
}

function makeRoomSelecter(name, on, id, xy, ct, bri) {
  let checkedStr = "";
  let firstColor = "20, 20, 20";
  let secondColor = "20, 20, 20";
  let colorConv = new ColorConverter();
  let sliderDisabled = "";
  if (on) {
    checkedStr = "checked";
    firstColor = "255, 233, 191";
    secondColor = "255, 233, 191";
    //console.log(ct, colorConv.colorTempToRGB(1010))
    if (xy) 
      firstColor = colorConv.xyBriToRgb(xy[0], xy[1], 255); // todo: Fix color
    else if (ct) 
      firstColor = colorConv.colorTempToRGB(1000000/(ct-200)); // Mired to kelvin, -200 for celebration https://en.wikipedia.org/wiki/Mired
  }
  else 
    sliderDisabled = 'style="display:none"';
  return `<div class="roomSelecter my-3" style="background: linear-gradient(to right, rgb(${firstColor}) 0%, rgb(${secondColor}) 100%);" class="btn roomSelecter my-2">
  <button class="btn roomBtn" onclick="selectRoom_click(${id});">${name}</button>
    <label class="switch swRight">
      <input type="checkbox" id="roomSwitch${id}" onclick="setRoomState_click(${id})" ${checkedStr}>
      <span class="slider"></span>
    </label>   
    <input type="range" min="0" max="255" value="${bri}" ${sliderDisabled} class="sliderBar" id="roomSlider${id}" onchange="setRoomState_click(${id})">
</div>`
}

function makeLightSelecter(light) {
  let colorConv = new ColorConverter();
  let color = "";
  let sliders = `<input type="range" min="0" max="255" value="${light.bri}" class="briSlider sliderBar" id="briSlider${light.id}" onchange="briSlider_change(${light.id})">`;

  if (light.on) {
    color = "255, 233, 191";
    if (light.xy) {
      color = colorConv.xyBriToRgb(light.xy[0], light.xy[1], 255); // todo: Fix color
      sliders += `<input type="range" min="0" max="255" value="${light.sat}" class="satSlider sliderBar" id="satSlider${light.id}" onchange="satSlider_change(${light.id})">
      <input type="range" min="0" max="65535" value="${light.hue}" class="hueSlider sliderBar" id="hueSlider${light.id}" onchange="hueSlider_change(${light.id})">`;
    }                                               // ^^^^ Hue does not change
    else if (light.ct) {
      color = colorConv.colorTempToRGB(1000000/(light.ct-200)); // Mired to kelvin, -200 for celebration https://en.wikipedia.org/wiki/Mired
      sliders += `<input type="range" min="153" max="500" value="${light.ct}" class="tempSlider sliderBar" id="tempSlider${light.id}" onchange="tempSlider_change(${light.id})">`;
    }
  }
  return `<div class="lightSelecter my-2" style="background-color: rgb(${color})"> 
  <button type="button" class="btn nowrapTxt" onclick="setLightState_click(${light.id}, ${light.on})">${light.name}</button>
  <button class="btn pickerActivator" type="button" data-bs-toggle="collapse" data-bs-target="#pickerPopup${light.id}" aria-expanded="true" aria-controls="pickerPopup${light.id}">v</button>
  <div class="collapse" id="pickerPopup${light.id}" class="accordion-collapse collapse show" data-bs-parent="#lightSelecters">
    <div class="card card-body pickerPopupCard">
        ${sliders}
    </div>
  </div>
  </div>`
}
