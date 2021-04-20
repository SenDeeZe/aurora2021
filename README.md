# Development

```
cd phaser-test
npm install
npm start
```

# Build

```
cd phaser-test
npm run build
cd ./dist
```

# Shaders
Due to problems with bundling shaders and requirement of the Phaser3 to get URL as input, we made following workaround:
1. Put your shaders in `public/shaders/`
2. In `preload` load shader
   
   ```this.load.glsl('fire', "./shaders/sample.frag");```
3. In `create` use shaders as game objects
   ```this.add.shader('fire', 300, 50, 400, 400);```
   
What we need: shader-based effects: explosions, spells, fire,
lightnings, portals, acid puddles and more. 