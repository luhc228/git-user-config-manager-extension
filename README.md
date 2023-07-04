<h2 align="center"><img src="./assets/logo.png" height="64"><br>Git User Config Manager</h2>
<p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=luhc228.git-user-config-manager" alt="Marketplace version">
        <img src="https://img.shields.io/visual-studio-marketplace/v/luhc228.git-user-config-manager?color=orange&label=VS%20Code%20Marketplace" />
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=luhc228.git-user-config-manager" alt="Marketplace Stars">
        <img src="https://img.shields.io/visual-studio-marketplace/stars/luhc228.git-user-config-manager" />
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=luhc228.git-user-config-manager" alt="Marketplace download counts">
        <img src="https://img.shields.io/visual-studio-marketplace/d/luhc228.git-user-config-manager?color=blueviolet&label=Downloads" />
    </a>
</p>

Do you ever have one more git user configs( for example one is for open source(GitHub) and another is for Work(GitLab))? And you use different username and email for your commits at work or for your open source repositories by mistake?

Git User Config Manager extension helps you manage and switch your git user configs easier and smarter. What's more, it also support [SSH Key generation](https://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key) and configure [gitdir config](https://git-scm.com/docs/git-config#_conditional_includes).

![first-hint](https://github.com/luhc228/git-user-config-manager-extension/assets/44047106/0e74061d-bd72-4c0d-8055-0270af764c7a)

### Features

- Check if your project has git user configs set up automatically
- Support Add, edit or delete your git user configs easier and switch one of them in VS Code faster
- Generate [SSH Key](https://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key) by your git user configs faster
- Add [gitdir config](https://git-scm.com/docs/git-config#_conditional_includes) to include some directories which will use one of your git user configs

### Usages

#### Add a Git User Config

![add](https://github.com/luhc228/git-user-config-manager-extension/assets/44047106/240f00fa-473e-4e42-8703-e0de2370e7d2)

#### Edit a Git User Config

![edit](https://github.com/luhc228/git-user-config-manager-extension/assets/44047106/baaa3184-dbb5-4098-84dc-bf296871dcc6)

#### Apply a Git User Config to Current Workspace

![apply](https://github.com/luhc228/git-user-config-manager-extension/assets/44047106/42be7dab-a3d1-4e1e-a91d-814976f40f24)

#### Delete a Git User Config

![remove](https://github.com/luhc228/git-user-config-manager-extension/assets/44047106/f4b701b2-23d7-45cd-a126-cffbab07a7e1)

#### Generate SSH Key

![generate-SSH](https://github.com/luhc228/git-user-config-manager-extension/assets/44047106/664d2a08-c7b5-4562-8150-16a09f5a9fb8)

#### Add gitdir config

All of your git project in your the directories of you configure gitdir config will use one of your git user configs. It means that you don't need to configure the git user config everytime.

![gitdir](https://github.com/luhc228/git-user-config-manager-extension/assets/44047106/874be82d-d4b3-4fb2-9611-7db97c7fe6c2)