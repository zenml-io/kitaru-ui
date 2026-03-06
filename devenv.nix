{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{

  packages = [
    pkgs.git
    pkgs.claude-code
  ];

  env.OBJC_DISABLE_INITIALIZE_FORK_SAFETY = true;
  # env.ZENML_DEBUG = "true";
  env.ZENML_ANALYTICS_OPT_IN = "false";

  scripts.install-kitaru-branch.exec = ''
    sh scripts/install-kitaru-branch.sh $1
  '';

  languages.python = {
    enable = true;
    package = pkgs.python312;
    venv.enable = true;
    uv.enable = true;
  };

  languages.javascript = {
    enable = true;
    npm = {
      enable = true;
    };
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.typescript = {
    enable = true;
  };

}