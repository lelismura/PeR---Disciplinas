// netlify/functions/updateJson.js
import { Octokit } from "@octokit/rest";

export async function handler(event) {
  try {
    const { path, content } = JSON.parse(event.body);
    const octokit = new Octokit({ auth: process.env.GH_TOKEN });
    const owner = "lelismura";        // seu usuário GitHub
    const repo  = "PeR---Disciplinas"; // nome exato do repositório
    const branch = "main";            // branch padrão

    // 1) Busca o SHA atual do arquivo
    const { data: file } = await octokit.repos.getContent({
      owner, repo, path, ref: branch
    });

    // 2) Atualiza o arquivo com o novo conteúdo
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update ${path} via Admin UI`,
      content: Buffer.from(content).toString("base64"),
      sha: file.sha,
      branch
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
