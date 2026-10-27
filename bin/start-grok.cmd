@echo off
rem Start Grok Build for the demo with this repo's config only (Windows).
rem Turns off Grok's Claude Code and Cursor compatibility for this process, so
rem personal ~/.claude and ~/.cursor setup doesn't load. Plain `grok` is unaffected.
rem Usage (PowerShell or cmd): bin\start-grok.cmd [grok arguments]
setlocal
for %%v in (CLAUDE CURSOR) do for %%s in (HOOKS SKILLS AGENTS RULES MCPS) do set "GROK_%%v_%%s_ENABLED=false"

rem A terminal opened before Grok was installed may not have it on PATH yet.
where grok >nul 2>nul || set "PATH=%USERPROFILE%\.grok\bin;%PATH%"

cd /d "%~dp0.."
grok %*
exit /b %ERRORLEVEL%
