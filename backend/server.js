// bhai ye code chalu hai isko mat chenda y rplease

// const express = require("express");
// const bodyParser = require("body-parser");
// const { spawn } = require("child_process");
// const cors = require("cors");
// const app = express();
// const PORT = 3700;

// app.use(cors());
// app.use(bodyParser.json());

// app.post("/scrape", async (req, res) => {
//   const { keywords } = req.body;

//   if (!keywords || !Array.isArray(keywords)) {
//     return res.status(400).json({ error: "Invalid keywords array" });
//   }

//   // Function to run Python script for each keyword
//   const runPythonScript = (keyword) => {
//     return new Promise((resolve, reject) => {
//       const pythonProcess = spawn("python3", [
//         "./app.py",
//         JSON.stringify([keyword]),
//       ]);

//       let data = "";
//       let error = "";

//       pythonProcess.stdout.on("data", (chunk) => {
//         data += chunk.toString();
//       });

//       pythonProcess.stderr.on("data", (chunk) => {
//         error += chunk.toString();
//       });

//       pythonProcess.on("close", (code) => {
//         if (code !== 0) {
//           reject(error);
//         } else {
//           try {
//             const result = JSON.parse(data);
//             resolve(result);
//           } catch (err) {
//             reject(err.message);
//           }
//         }
//       });
//     });
//   };

//   try {
//     // Run Python scripts in parallel
//     const results = await Promise.all(
//       keywords.map((keyword) => runPythonScript(keyword))
//     );

//     // Merge results and send back
//     const mergedResults = results.flat();
//     res.json({ success: true, results: mergedResults });
//   } catch (error) {
//     res.status(500).json({ error: "Error in processing", details: error });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// iske upar wala code hai final iss emt chde

// bhai ye wala code batch ke liye imp hai isse bhi m ched
const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const cors = require("cors");
const app = express();
const PORT = 3700;

app.use(cors());
app.use(bodyParser.json());

app.post("/scrape", async (req, res) => {
  const { keywords } = req.body;

  if (!keywords || !Array.isArray(keywords)) {
    return res.status(400).json({ error: "Invalid keywords array" });
  }
  const MAX_KEYWORDS = 20;
  if (keywords.length > MAX_KEYWORDS) {
    return res
      .status(200)
      .json({
        keyWorderror: `Keyword limit exceeded. Max allowed is ${MAX_KEYWORDS}`,
      });
  }
  const runPythonScript = (keyword) => {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python3", [
        "./app.py",
        JSON.stringify([keyword]),
      ]);

      let data = "";
      let error = "";

      pythonProcess.stdout.on("data", (chunk) => {
        data += chunk.toString();
      });

      pythonProcess.stderr.on("data", (chunk) => {
        error += chunk.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(error);
        } else {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (err) {
            reject(err.message);
          }
        }
      });
    });
  };

  // Function to process keywords in batches
  const processBatch = async (batch) => {
    return await Promise.all(batch.map((keyword) => runPythonScript(keyword)));
  };

  try {
    // Split keywords into batches of 15
    const batchSize = 15;
    const batches = [];
    for (let i = 0; i < keywords.length; i += batchSize) {
      batches.push(keywords.slice(i, i + batchSize));
    }

    let allResults = [];

    // Process each batch sequentially
    for (const [index, batch] of batches.entries()) {
      console.log(`Processing batch ${index + 1} of ${batches.length}...`);
      const results = await processBatch(batch);
      allResults = allResults.concat(...results.flat());
      console.log(`Batch ${index + 1} finished.`);
    }

    res.json({ success: true, results: allResults });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Error in processing", details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const { spawn } = require("child_process");
// const cors = require("cors");
// const axios = require("axios");
// const app = express();
// const PORT = 3700;

// app.use(cors());
// app.use(bodyParser.json());

// async function testProxy(proxy) {
//   try {
//     const response = await axios.get("http://httpbin.org/ip", {
//       proxy,
//       timeout: 5000,
//     });
//     if (response.status === 200) {
//       console.log(`Proxy is working. Your IP: ${response.data.origin}`);
//       return true;
//     }
//   } catch (error) {
//     console.log(`Proxy test failed: ${error.message}`);
//     return false;
//   }
// }

// const runPythonScript = (keyword, proxy) => {
//   return new Promise((resolve, reject) => {
//     const proxyEnv = proxy
//       ? {
//           HTTP_PROXY: `http://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`,
//           HTTPS_PROXY: `http://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`,
//         }
//       : {};

//     const pythonProcess = spawn(
//       "python3",
//       ["./app.py", JSON.stringify([keyword])],
//       {
//         env: { ...process.env, ...proxyEnv },
//       }
//     );

//     let data = "";
//     let error = "";

//     pythonProcess.stdout.on("data", (chunk) => {
//       data += chunk.toString();
//     });

//     pythonProcess.stderr.on("data", (chunk) => {
//       error += chunk.toString();
//     });

//     pythonProcess.on("close", (code) => {
//       if (code !== 0) {
//         reject(error);
//       } else {
//         try {
//           const result = JSON.parse(data);
//           resolve(result);
//         } catch (err) {
//           reject(err.message);
//         }
//       }
//     });
//   });
// };

// app.post("/scrape", async (req, res) => {
//   const { keywords } = req.body;

//   if (!keywords || !Array.isArray(keywords)) {
//     return res.status(400).json({ error: "Invalid keywords array" });
//   }

//   const proxy = {
//     host: "208.195.160.45",
//     port: "65095",
//     auth: { username: "TP83691922", password: "rGAfBbMA" },
//   };

//   const isProxyWorking = await testProxy(proxy);

//   if (!isProxyWorking) {
//     return res.status(500).json({ error: "Proxy is not working" });
//   }

//   try {
//     const batchSize = 15;
//     const batches = [];
//     for (let i = 0; i < keywords.length; i += batchSize) {
//       batches.push(keywords.slice(i, i + batchSize));
//     }

//     let allResults = [];

//     for (const [index, batch] of batches.entries()) {
//       console.log(`Processing batch ${index + 1} of ${batches.length}...`);
//       const results = await Promise.all(
//         batch.map((keyword) => runPythonScript(keyword, proxy))
//       );
//       allResults = allResults.concat(...results.flat());
//       console.log(`Batch ${index + 1} finished.`);
//     }

//     res.json({ success: true, results: allResults });
//   } catch (error) {
//     res.status(500).json({ error: "Error in processing", details: error });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const { spawn } = require("child_process");
// const cors = require("cors");

// const app = express();
// const PORT = 3700;

// app.use(cors());
// app.use(bodyParser.json());

// app.post("/scrape", (req, res) => {
//   const { keywords } = req.body;

//   if (!keywords || !Array.isArray(keywords)) {
//     return res.status(400).json({ error: "Invalid keywords array" });
//   }

//   const pythonProcess = spawn("python3", [
//     "./app.py",
//     JSON.stringify(keywords),
//   ]);

//   let data = "";
//   let error = "";

//   pythonProcess.stdout.on("data", (chunk) => {
//     data += chunk.toString();
//   });

//   pythonProcess.stderr.on("data", (chunk) => {
//     error += chunk.toString();
//   });

//   pythonProcess.on("close", (code) => {
//     if (code !== 0) {
//       return res
//         .status(500)
//         .json({ error: "Python script error", details: error });
//     }

//     try {
//       const results = JSON.parse(data);
//       res.json({ success: true, results });
//     } catch (err) {
//       res
//         .status(500)
//         .json({ error: "Failed to parse Python output", details: err.message });
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
