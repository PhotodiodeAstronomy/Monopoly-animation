const anim = new Manim("#animation");

anim.scene(() => {
  // Axes
  const axes = anim.axes({ x: { min:0, max:220 }, y: { min:0, max:220 } });
  const caption = document.getElementById("caption");

  // Curves (same numbers I gave earlier)
  const ATC = anim.curve((q) => 50 + 1000/q + 0.01*q*q, { stroke: "#1f77b4", strokeWidth: 5 });
  const MC  = anim.curve((q) => 50 + 0.02*q,         { stroke: "#ff7f0e", strokeWidth: 5 });
  
  // Phase 1: Perfect Competition
  caption.textContent = "Perfect Competition – all three points coincide";
  const Pcomp = anim.line([[0,90],[200,90]], { stroke: "#2ca02c", strokeWidth: 5 });
  const dot1 = anim.circle([100,90], 0.15, { fill: "#9467bd" });
  anim.play([ATC.fadeIn(), MC.fadeIn(), Pcomp.fadeIn(), dot1.fadeIn()], 2);
  anim.wait(2);

  // Label the single point
  anim.text("Min ATC = Profit-max Q = Social optimum", [100, 60], { fill: "#9467bd" }).fadeIn(1);
  anim.wait(3);

  // Phase 2: Transition to Monopoly
  caption.textContent = "The same industry becomes a monopoly...";
  anim.play(Pcomp.fadeOut(), 1);
  
  const demand = anim.line([[0,200],[200,0]], { stroke: "#d62728", strokeWidth: 5 });
  const MR     = anim.line([[0,200],[100,0]], { stroke: "#d62728", strokeWidth: 5, strokeDasharray: "8 8" });
  anim.play([demand.fadeIn(), MR.fadeIn()], 2);

  // Move the three dots apart
  caption.textContent = "Watch the three points tear apart";
  const redDot   = anim.circle([75,125], 0.15, { fill: "#e377c2" });   // MR=MC
  const blueDot  = anim.circle([100,90], 0.15, { fill: "#1f77b4" });   // min ATC
  const greenDot = anim.circle([150,90], 0.15, { fill: "#2ca02c" });   // P=MC

  anim.play(
    dot1.moveTo([75,125]), dot1.change({ fill: "#e377c2" }),
    blueDot.fadeIn(), greenDot.fadeIn(),
    3
  );

  // Deadweight loss & monopoly rectangle
  const dwl = anim.polygon([[75,125],[150,90],[150,125]], { fill: "#ff9999", opacity: 0.6 });
  const profit = anim.polygon([[0,90],[75,90],[75,125],[0,125]], { fill: "#99ff99", opacity: 0.5 });
  anim.play([dwl.fadeIn(), profit.fadeIn()], 1.5);

  // Final labels
  caption.textContent = "Monopoly: three separate points → inefficiency + rents";
  anim.text("Profit-max Q (pink)", [75,135], { fill: "#e377c2" }).shift([0,10]).fadeIn();
  anim.text("Min efficient scale (blue)", [100,70], { fill: "#1f77b4" }).fadeIn();
  anim.text("Social optimum (green)", [150,70], { fill: "#2ca02c" }).fadeIn();
  anim.wait(5);
});
