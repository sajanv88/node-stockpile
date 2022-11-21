import NodeStockpile from "..";

describe('NodeStockpile', () => {
    let cache: NodeStockpile;
    it('Should have store a string value with a key and size of the stockpile has to be 1', async () => {
        cache = new NodeStockpile({expiresIn: 200});
        await cache.init();
        await cache.save('test', {'name': 'sajan', "hobbies": ['gym', 'blogging']});
        expect(cache.size()).toEqual(1);
    })
    
})