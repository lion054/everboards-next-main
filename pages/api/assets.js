import querystring from 'querystring';
import nc from 'next-connect';
import cors from 'cors';

const handler = nc()
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
    optionsSuccessStatus: 200
  }))
  .get(async (req, res) => {
    const { contract_address, token_id } = req.query;
    if (!contract_address && !token_id) {
      const queryParams = querystring.stringify({
        order_direction: 'desc',
        offset: 0,
        limit: 20
      });
      const url = `https://api.opensea.io/api/v1/assets?${queryParams}`;
      try {
        const result = await fetch(url);
        const assets = await result.json();
        res.status(200).json(assets);
      } catch (e) {
        res.status(200).json([]);
      }
    } else {
      const url = `https://api.opensea.io/api/v1/asset/${contract_address}/${token_id}`;
      try {
        const result = await fetch(url);
        const asset = await result.json();
        res.status(200).json(asset);
      } catch (e) {
        res.status(200).json({});
      }
    }
  });

export default handler;
