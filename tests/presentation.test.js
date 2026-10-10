import test from 'node:test';
import assert from 'node:assert/strict';
import { label, resourceLabel } from '../src/utils/labels.js';
import { resolveTheme } from '../src/utils/theme.js';
test('Spanish enum labels retain internal API values', () => {
 assert.equal(label('Under offer'), 'En oferta');
 assert.equal(label('Qualified'), 'Calificado');
 assert.equal(label('Completed'), 'Completada');
 assert.equal(resourceLabel('properties'), 'Propiedades');
 assert.equal(label('Custom'), 'Custom');
});
test('theme uses saved choice or system preference', () => {
 assert.equal(resolveTheme('light', true), 'light');
 assert.equal(resolveTheme('dark', false), 'dark');
 assert.equal(resolveTheme(null, true), 'dark');
 assert.equal(resolveTheme('invalid', false), 'light');
});
import { readFileSync } from 'node:fs';
test('translated select labels keep original submitted values', () => {
 const form=readFileSync(new URL('../src/components/RecordForm.jsx',import.meta.url),'utf8');
 const collection=readFileSync(new URL('../src/pages/Collection.jsx',import.meta.url),'utf8');
 assert.match(form,/<option key=\{x\} value=\{x\}>\{enumLabel\(x\)\}/);
 assert.match(collection,/<option key=\{x\} value=\{x\}>\{label\(x\)\}/);
});
test('collection hook returns the public records property',()=>{
 const source=readFileSync(new URL('../src/hooks/useCollection.js',import.meta.url),'utf8');
 assert.match(source,/return \{ records, loading, error, reload \}/);
});
test('login requires a manually entered password',()=>{
 const source=readFileSync(new URL('../src/pages/Login.jsx',import.meta.url),'utf8');
 assert.match(source,/\[password, setPassword\] = useState\(""\)/);
 assert.match(source,/autoComplete="current-password"/);
});
