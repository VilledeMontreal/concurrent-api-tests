// import { apiTestSuite} from '@villedemontreal/mocha-concurrent-api-tests';
// import { assert } from 'chai';
// import { describe, expect, it } from 'vitest'

// apiTestSuite(
//   'sample test suite',
//   '3 seconds',
//   'http://base-url.com',
//   30,
//   2,
//   5000,
//   () => {
//     it('Test pass', () => {
//         assert.strictEqual(1, 1);
//     });
//     it('Test with error', () => {
//         const error = new Error('Pow!') as any;
//         error.additionnalAttribute = "The key to understand this bug." 
//         throw error;
//     });
//     let iFlakyOnce =0;
//     it('Flaky once', () => {
//         iFlakyOnce++;
//         if(iFlakyOnce<=1){
//             const error = new Error('Pow!Flaky:'+iFlakyOnce ) as any;
//             error.additionnalAttribute = "The key to understand this bug."
//             throw error;    
//         }
//     });
//     let iFlakyTwice =0;
//     it('Flaky twice', () => {
//         iFlakyTwice++;
//         if(iFlakyTwice<=2){
//             const error = new Error('Pow!Flaky:'+iFlakyTwice ) as any;
//             error.additionnalAttribute = "The key to understand this bug. Flaky:"+iFlakyTwice 
//             throw error;    
//         }
//     });            
//   },
// );
