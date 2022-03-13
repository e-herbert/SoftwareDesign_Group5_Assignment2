const unittest = require("../public/main.js");

global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(true)
}));



// describe("Unit Test", () => {
//     test('Login should return true', async () => {
//         var res = await login("jdbfkjvbkaf", "dhvkdvjkdf", true)
//         // console.log(res)
//         expect(res).toBe(true)
//     })
// });

it('getQuote', async () => {
    
    const data = await unittest.getQuote(3, false, true);
    expect(data).toBe(true);
  });

it('Login', async () => {
    
    const data = await unittest.login("jdbfkjvbkaf", "dhvkdvjkdf", true);
    expect(data).toBe(true);
} );

it('register', async () => {
    
    const data = await unittest.register("jdbfkjvbkaf", "dhvkdvjkdf", true)
    expect(data).toBe(true);
} );