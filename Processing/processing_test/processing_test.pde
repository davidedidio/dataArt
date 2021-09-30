void setup() {
  size(640, 360, P3D);
}

void draw() {
  background(102);
  noFill();
  
  pushMatrix();
  translate(width*0.2, height*0.5);
  rotate(frameCount / 20.0);
  polygon(0, 0, 82, 3);  // Triangle
  box(100);
  popMatrix();
  
  pushMatrix();
  translate(width*0.5, height*0.5);
  rotate(frameCount / 50.0);
  polygon(0, 0, 80, 20);  // Icosahedron
  box(100);
  popMatrix();
  
  pushMatrix();
  translate(width*0.8, height*0.5);
  rotate(frameCount / -100.0);
  polygon(0, 0, 70, 7);  // Heptagon
  popMatrix();
}

void polygon(float x, float y, float radius, int npoints) {
  float angle = TWO_PI / npoints;
  beginShape();
  for (float a = 0; a < TWO_PI; a += angle) {
    float sx = x + cos(a) * radius;
    float sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
