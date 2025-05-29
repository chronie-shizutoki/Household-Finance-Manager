const express = require('express');
const router = express.Router();

// 示例块列表数据
const blockList = ["example-domain.com", "test-site.org"];

router.get('/', (req, res) => {
  res.json(blockList);
});

module.exports = router;