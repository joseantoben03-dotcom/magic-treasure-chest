import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Sparkles, Layers, Info } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const HashVisualizer = () => {
  const { registerVisualizerWord, visualizerWordsTested, nerdMode } = useGame();
  const { playClick, playSuccess } = useSoundFX();

  const [inputKey, setInputKey] = useState('star');
  const [showCollisionDemo, setShowCollisionDemo] = useState(false);

  const handleInputChange = (val) => {
    setInputKey(val);
    if (val.trim()) {
      registerVisualizerWord(val.trim());
    }
  };

  const handlePreset = (word) => {
    playClick();
    setInputKey(word);
    registerVisualizerWord(word);
  };

  const handleTriggerCollision = () => {
    playClick();
    setShowCollisionDemo(prev => !prev);
  };

  // Step 1: Characters & ASCII
  const chars = inputKey.split('');
  const asciiValues = chars.map(c => ({ char: c, code: c.charCodeAt(0) }));
  const charSum = asciiValues.reduce((acc, curr) => acc + curr.code, 0);

  // Step 2 & 3: Deterministic Hash & Modulo 1000
  const hashCode = charSum * 1234567;
  const drawerNumber = Math.abs(hashCode % 1000);

  // Collision demo values (e.g., words with same sum)
  const collisionWordA = 'cat'; // 99 + 97 + 116 = 312
  const collisionWordB = 'act'; // 97 + 99 + 116 = 312
  const collisionDrawer = Math.abs((312 * 1234567) % 1000);

  return (
    <div className="hash-visualizer-card glass-card" style={{ padding: '26px', border: '1px solid var(--secondary)', background: 'rgba(0, 240, 255, 0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--secondary)', margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={20} /> Interactive Hash Visualizer
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Type any word to see how mathematical magic computes the drawer index instantly!
          </p>
        </div>

        {/* Word count tracker for Curious Cat badge */}
        <div style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '12px', color: 'var(--accent)' }}>
          🐱 Words tested: {visualizerWordsTested.length}/5
        </div>
      </div>

      {/* Input Field + Presets */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          className="web3-input"
          value={inputKey}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type any key (e.g. star, ruby, wizard)..."
          style={{ width: '100%', borderColor: 'var(--secondary)', fontSize: '1.1rem', marginBottom: '10px' }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick tests:</span>
          {['star', 'heart', 'skull', 'crown', 'gem', 'magic'].map(w => (
            <button
              key={w}
              onClick={() => handlePreset(w)}
              style={{
                background: inputKey === w ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.06)',
                color: inputKey === w ? '#000' : '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              "{w}"
            </button>
          ))}

          <button
            onClick={handleTriggerCollision}
            style={{
              marginLeft: 'auto',
              background: showCollisionDemo ? 'var(--accent)' : 'rgba(242, 201, 76, 0.15)',
              color: showCollisionDemo ? '#000' : 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={14} /> {showCollisionDemo ? 'Hide Collision Demo' : 'Oops, Collision! Demo'}
          </button>
        </div>
      </div>

      {/* Normal Step-by-Step Visualization */}
      {!showCollisionDemo ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Step 1: Character Split & ASCII */}
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '8px' }}>
              1. Split into Letters & Numerical ASCII Character Codes:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {asciiValues.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(0, 240, 255, 0.12)',
                    border: '1px solid var(--secondary)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.05rem' }}>'{item.char}'</div>
                  <div style={{ color: 'var(--secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>={item.code}</div>
                </div>
              ))}
              <div style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '6px' }}>
                Sum = <strong>{charSum}</strong>
              </div>
            </div>
          </div>

          {/* Step 2: Hash Math Formula */}
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '6px' }}>
              2. Compute Hash Code (Mathematical scramble):
            </div>
            <div style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: '1.05rem' }}>
              hash("{inputKey}") = {charSum} × 1,234,567 = <strong>{hashCode.toLocaleString()}</strong>
            </div>
          </div>

          {/* Step 3 & 4: Modulo & Target Drawer */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 255, 163, 0.1))',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid var(--secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ color: '#C8F8FF', fontSize: '0.82rem', marginBottom: '4px' }}>
                3. Fit into 1,000 Drawers using Modulo (%) Formula:
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#fff' }}>
                {hashCode.toLocaleString()} % 1,000 = <strong style={{ color: 'var(--success)', fontSize: '1.3rem' }}>{drawerNumber}</strong>
              </div>
            </div>

            {/* Glowing Drawer Box */}
            <motion.div 
              style={{
                background: 'rgba(0, 255, 163, 0.25)',
                border: '2px solid var(--success)',
                borderRadius: '12px',
                padding: '12px 20px',
                textAlign: 'center',
                boxShadow: '0 0 25px rgba(0, 255, 163, 0.4)'
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div style={{ fontSize: '0.75rem', color: '#000', background: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                TARGET DRAWER
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', marginTop: '4px' }}>
                #{drawerNumber}
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        /* Collision Demonstration */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(242, 201, 76, 0.08)',
            border: '1px solid var(--accent)',
            borderRadius: '14px',
            padding: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>
            <Sparkles size={18} /> What if Two Keys Land in the Same Drawer? (Hash Collision!)
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '14px' }}>
            Notice that anagrams like <code>"{collisionWordA}"</code> and <code>"{collisionWordB}"</code> have the same letters and ASCII sum! Both formula calculations output <strong>Drawer #{collisionDrawer}</strong>.
          </p>

          {/* Visual Chaining Demonstration */}
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px dashed var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            <div style={{ background: 'var(--accent)', color: '#000', padding: '10px 14px', borderRadius: '10px', fontWeight: 'bold' }}>
              Drawer #{collisionDrawer}
            </div>
            <span style={{ color: '#fff' }}>contains a linked list (Chaining):</span>
            
            <div style={{ background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--secondary)', padding: '6px 12px', borderRadius: '8px', color: '#fff' }}>
              ["cat" ➡️ "Catnip Pouch 🌿"]
            </div>
            <span style={{ color: 'var(--accent)' }}>➡️</span>
            <div style={{ background: 'rgba(255, 46, 147, 0.15)', border: '1px solid var(--primary)', padding: '6px 12px', borderRadius: '8px', color: '#fff' }}>
              ["act" ➡️ "Theater Mask 🎭"]
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#FFF1C5', marginTop: '12px' }}>
            {nerdMode 
              ? "🎓 In CS, this is called 'Collision Resolution via Chaining' (or Open Addressing). Because the linked list at each bucket is tiny (1 or 2 items), lookup remains amortized O(1)!" 
              : "🎒 The drawer simply holds a tiny mini-bag with both items tagged with their exact sticker name, keeping both completely safe!"}
          </div>
        </motion.div>
      )}
    </div>
  );
};
