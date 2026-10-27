@echo off
rem Start Grok Build for the demo with this repo's config only (Windows).
rem Turns off Grok's Claude Code and Cursor compatibility and Grok's memory for this
rem process, so personal ~/.claude and ~/.cursor setup and notes from earlier
rem sessions don't load. Plain `grok` is unaffected.
rem Usage (PowerShell or cmd): bin\start-grok.cmd [grok arguments]
setlocal
for %%v in (CLAUDE CURSOR) do for %%s in (HOOKS SKILLS AGENTS RULES MCPS) do set "GROK_%%v_%%s_ENABLED=false"
set "GROK_MEMORY=0"

rem A terminal opened before Grok was installed may not have it on PATH yet.
where grok >nul 2>nul || set "PATH=%USERPROFILE%\.grok\bin;%PATH%"

cd /d "%~dp0.."
grok %*
exit /b %ERRORLEVEL%
