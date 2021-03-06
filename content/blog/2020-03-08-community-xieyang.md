---
title: Serverless 的前景和机会
description: 本文为 Serverless 社区成员撰稿。作者谢扬，蒸汽记忆创始人，SoLiD 中文社区（learnsolid.cn）发起人。目前聚焦研发一款 IDaaS 身份即服务产品 Authing
keywords: Serverless前景,Serverless机会,Serverless使用场景
date: 2020-03-08
thumbnail: https://img.serverlesscloud.cn/2020318/1584509669262-qian.jpg
categories:
  - user-stories
authors:
  - 谢扬
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
---

Serverless 正在改变未来软件开发的模式和流程，对于大多数应用而言，借助 Serverless 服务，开发者可以将绝大多数精力投入在业务逻辑的开发整合上，大大缩短开发周期，降低运维成本。本文将探讨 Serverless 生态中缺少的工具以及潜在的创业机会。

我们目前创业做的事情跟 Serverless 也是非常强相关的，目前聚焦研发一款 IDaaS 身份即服务产品 Authing。我之前在字节跳动负责一款日活过亿的 Serverless 产品 LarkCloud。我个人对 Serverless 保持着长期的关注，对 Serverless 行业的发展也有很多想法，今天也跟大家分享一下。

本文主要分为四个主题：

> 1、第一个是 Serverless 架构的介绍；
>
> 2、第二个是 Serverless 的一些使用场景；
>
> 3、第三个是 Serverless 的使用报告，这个报告是来自于：O’Reilly Serverless survey 2019 的调研；
>
> 4、第四是跟大家展望一下未来的 Serverless 工具链是什么样子，以及它的前景和机会

## 一、Serverless 架构介绍

### 1）云计算的发展

关于Serverless 架构，在看这个架构之前，我们先来回顾一下云计算的发展。图中蓝色这部分是由用户来进行管理的这一部分，黄色这一部分是由云服务商来进行管理的。从早期的 On-Premises 到 FaaS ，这是云计算的发展历程。

![img](https://img.serverlesscloud.cn/2020318/1584511844418-IMG_0195.PNG)

On-Premises 的时候，机房所有的硬件、操作系统、容器、运行时环境、应用、函数等都需要自己管理；发展到 IaaS 之后，那么开发商他们不需要维护自己的硬件了，但是还是需要维护很多东西。

后来 CaaS 服务出现，容器即服务，我们自己不需要再维护操作系统层面的东西，只需要维护容器，K8s 这么短时间火起来，这也是一个很重要的原因。

那么再往下就是像阿里云、AWS 这种云计算 PaaS 平台出来，做了很多周边的一些工具，比如说各种各样的监控、报警，还有整个的服务器管理的控制台，然后有了这种服务之后，让客户连这些服务也不用自己来管理了，只需要管理自己的应用就好了，这就是 PaaS 服务。

再到现在，出现 FaaS 的产品形态，最右边的 FaaS 是蓝色的，下层所有模块都是黄色的，由云服务商提供，中间还有一个灰色模块 Application ，需要云服务商和用户一起进行管理。

那么这是 FaaS 的一个演进历史，总的来说 FaaS、PaaS、CaaS 等服务发展出来的缘由：就是让更多的客户能够专心自己的业务，而不需要去维护底层这么多跟业务无关的基础设施。

### 2）Serverless 架构

接下来看一下 Serverless 架构，这里我们以 AWS 的一些服务为例，最左边的一个User Agent（用户），从浏览器去访问一个系统，首先会经过一个API Gateway，API Gateway会出发一个函数 Cloud Function，在AWS中叫 Lambda，然后 Lambda 会去执行一些获取资源、业务操作，这些资源都是受限的，它可能是亚马逊的 DynamoDB、也可能是 AWS S3 存储、也可能是亚马逊的 EC2，也可能是你自己的一个社交数据以及通讯录好友等。

![img](https://img.serverlesscloud.cn/2020318/1584511934288-IMG_0191.PNG)

这些资源默认是受限的，受限的时候就需要去访问一个无服务器的身份认证系统，即图中的 Authing ，用户通过 Authing 进行登录，认证完成之后会获取一个 Token，然后用户带 Token 去请求资源，这个时候这个后端必须验证 Token 是合法的，才能够获取用户有权限访问的资源。这是 Serverless 整体的访问的一个流程。

现在很多人把 Serverless 分为两块，一块叫做 FaaS（函数即服务）Functions as a Service的缩写，只需要执行一个函数，上传一个函数，然后这些函数来执行一些操作，比如说读取你的通讯、你的地址，或读取其他的业务信息。

另外一块叫做 BaaS（后端即服务），全称是 Backend as a Service，就是把整个 BaaS 代码上传到服务器，然后它会自动给你做一些弹性伸缩。

其实函数的粒度更细一些，然后我们今天主要探讨的还是FaaS，BaaS 现在发展的不是特别好，我个人也不是很看好 BaaS 这块的市场。

### 3）FaaS 函数的生命周期

![img](https://img.serverlesscloud.cn/2020318/1584511844052-IMG_0195.PNG)

接下来我们了解一下 FaaS 的生命周期，FaaS 的全称是 Functions as a Service，开发者只需要开发一个函数，然后这个函数会根据函数的访问量来自动的做一些收缩。FaaS 有触发器，就是从哪一方进行调用，比如：你在浏览器上请求一个 FaaS ，那么就是收到一个 HTTP 请求。又如说某个图片被上传到了腾讯云的 OSS 里面（OSS 是腾讯的存储服务），那么上传成功之后有一个回调消息，这个消息会去触发 FaaS 函数，这个就叫做 Webhook。还有一类物联网场景，比如温度采集器，测量到温度之后，会有一种 Pub/Sub 这种消息模型，这种消息模型是异步的，也是会执行这样一个 FaaS 触发器。

那么一旦是触发了 FaaS 的执行，就会启动一个VM （虚拟机），那么这个 VM （虚拟机）目前主要分为两类：一类是直接 Fork 进程，然后在进程里执行这段代码，另一类就是去启动一个容器，然后在容器里面执行。在 Process 进程里执行代码的方式是不太安全的，所以现在很多人都转向了容器。当然容器的问题在于冷启动时间会非常长，也就是说假如这个函数本身执行时间只有 200 毫秒，如果加上容器的启动时间可能也是 200 毫秒，总共的时间可能变成了 400 毫秒，那么就会造成一些网络延迟，最后对用户体验产生影响。

启动了这样一个 VM 之后，就会去运行这个函数，运行结束之后就会把这个实例给销毁掉，同时云服务商会根据你的运行时间来计算、所耗费的资源如：CPU、内存、包括带宽等等，然后计算这次运行花多少钱，来进行一次扣费。

这就是 FaaS 函数的生命周期，接下来给大家剖析一下：为什么我们要用 FaaS ？

### 4）IaaS 模型

### ![img](https://img.serverlesscloud.cn/2020318/1584511972180-IMG_0193.JPG)

首先，我们先来看 IaaS 模型。分别从四个视角来看一下 IaaS 的整体架构：

- 第一是从 Service Models 视角，即服务模式，分为 IaaS、PaaS、SaaS。

- 第二是从 Cloud Stack 视角，阐释来云计算是由最底层基础设施层、应用程序栈、应用程序、用户层 来构成。

- 第三是从 Stack Components 视角，来看一下详细的构成组件：

- - 基础设施层：就是各种各样的硬件资源，如CPU、网络、带宽、硬盘等等，由基础设施厂商来提供服务，并保障最基础的系统安全。
  - Application Stack：就是需要构建应用所需要的基础软件技术栈，包括了操作系统、编程语言、应用服务器、中间件、数据库（关系数据库、图数据库、亦或是非关系数据库等）、还有报警监控服务、DevOps、CI/CD、API Gateway 等。
  - Application 层：开发者去建立自己的业务模型、业务应用的时候所需要的开发组件，「认证、授权」是其中最基础的组件，然后是 UI（即用户界面）、一些事务，比如你的支付、或直播的事务等。另外是一些报告，涉及与业务相关的用户的增长数据的报告、管理业务的使用情况，Key Metrics 是什么样子；另外还需要一个后台对所有资源进行管理。
  - 用户层：包含用户登录、注册、管理等。

- 第四是从不同服务模式下计算服务供应商和客户之间的责任边界。

- - IaaS 模式下：IDC 供应商的责任是搭建最基础的硬件基础设施、并对保障整个系统的安全。而客户需要从 OS 底层来搭建整个计算、应用环境、以及业务的开发。
  - PaaS 模式下：类似 AWS、阿里云等云服务提供商承担了基础设施的建设、以及核心基础软件环境的搭建。如操作系统、数据库、中间件、监控服务，把这些服务抽象成了一层云，然后提供给企业进行使用。客户只需要专注在应用环境搭建、及业务层面的开发。
  - SaaS 模式下：云服务厂商更进一步的把「应用环境」也服务化，客户仅需考虑业务层面的事情。比如应用层比较重要的两个模块：认证和授权模块也被SaaS 服务化；甚至 User 层的用户注册、登录、管理功能也被 SaaS 化，在美国的已经有 Auth0、Okta 等厂商提供这方面的服务，在中国我们 Authing 也在做类似的事情：IDaaS 身份即服务。有了 IDaaS 客户可以更直接开发业务，不需要操心：注册、登录、用户管理、认证、授权等功能。

回头来看在 IaaS 时代客户需要做很多事情，基建和研发成本极高，进入市场的时间成本很大。但是经过一系列「服务化」进程后，客户愈加仅需关注自己的业务代码，快速实现、快速进入市场进行验证及销售，这也是从2019年开始，Low code/No code 的创业项目备受资本热捧。

### 5）CaaS 容器模型

![img](https://img.serverlesscloud.cn/2020318/1584511844049-IMG_0195.PNG)

随着技术迭代，进入到了容器模型的时代，企业的运维需要管理更多的产品矩阵及服务的稳定。首先是各种各样的服务发现、Container Runtime、包括整个容器集群的管理，还有一些安全性问题、性能问题，基于角色的访问控制（RBAC）、 LDAP/AD 的管理、以及 SSO 的实现等。

对于开发者、运维需要学习很多 SSO 的知识，以及其他跟业务无关的很多东西，这加重了他们管理的负担。CaaS 容器模型让我们整个服务的可伸缩性大大提高了，但是也大大加重了运维人员的负担。

### 6）Serverless 模型

![img](https://img.serverlesscloud.cn/2020318/1584511844056-IMG_0195.PNG)

行业逐步发展到了今天的 Serverless 模型，在之前模型下客户需要操心很多的组件。但是，进入Serverless 模型后，客户仅需要关心是「业务代码」，设计好自己的业务模型，把代码部署到云服务中，就可以完成所有的复杂的一系列的部署、运维、监控等操作。

 **a. FaaS 优势**

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLEIGNwib2XABG2wrMxnSMcrQmlR33IE3XEkXiavcfTRklXQqtLn9YEhKg/640?wx_fmt=png)Serverless 带来的好处，首先是：零运维，也叫做零管理。除了零运维和零管理之外，还有其他很多优势，比如说按运行时间付费，你运行多长时间，就付多少钱；没有运行资源损耗的时候，不需要付任何钱。

举个例子，可以看上面这张图，蓝色的线代表是每秒处理多少请求；红色的线是处理这些请求需要的服务器数量。可以看到蓝色的线有两个峰值，这代表需要 200 台服务器，在传统的架构下就需要准备 200 台服务器。那么有了 FaaS 之后，就不需要买那么多服务器，只需要是把这个业务逻辑写好，然后它会自动为你进行伸缩。

伸缩的策略也非常多，比如用机器学习来进行预测，或者说可以用一些即时计算进行预测等等。运维人员只需要去考虑管理更少的服务器，开发人员只需要去关心业务代码，就可以让企业更快进入市场，并且能够造一个原生的微服务，显著降低企业的管理和维护负担。

**b. FaaS 劣势**

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLice8XiapHGtmZNrErfl9TGQ8C0uvHkxJKictWD1nk9u5u98RZ3ttj7iaaA/640?wx_fmt=png)

除了优势之外，FaaS 还有很多劣势，没有一个通用的标准。比如 AWS、Google，还有国内腾讯、阿里云、华为、京东云都有 FaaS 服务，但他们没有一个通用的标准；这也造成了：客户被供应商锁定的问题，无法便捷迁移。比如说我现在用 AWS，每天请求可能上亿，想要迁移到阿里云和腾讯云就非常的麻烦。第 2 点是 FaaS 是一个黑盒子环境，开发者需要去非常了解这个东西的底层是怎么回事，他才能敢去使用，否则他无法去预估一些潜在的风险。第 4 是冷启动的问题，也不算什么太大的问题，云厂商已经解决了这类问题，有很多处理方式。

第 5 个问题是最要命的一个问题，目前的 FaaS 是没有经过一个非常复杂应用案例的验证。假如说我想用 Serverless 开发一个淘宝、QQ、微信或者一个直播软件，目前是没有这种案例的。一方面主要是因为生态的缺乏，另外一方面的话也是因为开发人员的思维认知没有提升，这绝对不是一个技术的问题，技术已经非常成熟。

**c. FaaS 厂商**

下图是全球范围内在做 FaaS 的厂商，第一个 OpenWhisk 是 IBM 的开源的 FaaS 框架。另外一个是大家都知道的 AWS 的 Lambda，亚马逊的云服务算是业界的一个标准，还有 Google、微软都有类似的服务。国内主要是阿里云、腾讯云、华为云，除了这三家之外，其实京东、滴滴其他的云都有。另外一家就是字节跳动，他们叫做轻服务，这也是我当时在字节跳动开发的一款服务。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLU2ic7E3V4Uwrqo3O4eDrTHxIaGoQktDaPicSYEcwSqbKjuCekBMDKhwg/640?wx_fmt=png)

此外，还有一股不可忽视的力量，就是美国的 Auth0，是一款 IDaaS - 身份认证即服务，把身份认证上云，他们拥有一个 Webtasks 产品，可以让用户、开发者通过他们的服务快速完成身份认证功能，更多的精力聚焦到具体的业务方面。另外一个就是我们在做的 Authing ，未来的话也会有一个 FnSuite 这样一款函数产品，会和我们的业务有一个非常好的打通。

## 2. Serverless 使用场景

### 1）无服务器的应用后端场景

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLA8ry4MNgN5f7F2OKmDBfLGPfa1T63BrSo3WA2MQFMsGgqJYiaOicqiaOw/640?wx_fmt=png)

接下来介绍一下 Serverless 的使用场景。

首先第一类就是这种无服务器的应用后端，比如说我写了一段代码，然后我把它 push 到 Github 上去，这个时候 Github 的 webhook，我需要让它通知到我的 Slack 或者我的飞书。

假如没有 Serverless 的情况下，需要自己写一个代码后端框架，然后自己拼接一下，写个路由，写完路由之后，还需要再把它部署到服务器上去，然后再部署运维。

那么有了 FaaS 之后，只需要写个函数，把它传到阿里云或者腾讯云上，云服务商返回一个 API 链接，开发者把链接填到 Github 上去，就完成了整个操作流程，非常简单。

还有一种是新闻消息推送应用，一个新的用户，它注册了一个应用，然后在我们这个消息里面就推送给他一些新闻。

再比如物联网的应用的后端，比如说一个温度的信息推送系统，经过 Pub/Sub 之后来去调用一个函数，然后我们的函数来执行一些具体业务操作，比如推送到我们后台里面进行监测和管理，以及一些报警等。

这就是 Serverless 的第一类无服务器应用后端场景，如 QQ、微博、微信 IM 以及简单的消息推送场景，都可以使用Serverless。

### 2）人工智能应用场景

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLNLv7497Wkcf5GB7oguvZPPWG1lliaHFdG0XlfibxR5EOCpn8lh4OOPAA/640?wx_fmt=png)

第二类场景：人工智能应用。这张图来自 Google，大家可以从左往右看，比如通过 Slack、 Messenger、或 Google Home 和机器人对话，会发送一个 Http 请求，这个请求会在云端执行函数，然后这个函数会请求谷歌的 Dialogflow 是谷歌的一项对话管理服务。

Dialogflow 把多轮的对话管理起来，后面的其他服务：ML、Vision API 等都是由云服务商提供的能力，该厂商的 Cloud Functions （云函数）就可以直接调用这些能力，这对云服务厂商来说是非常大的一个优势。

所以说 Serverless 只能由这些 BigTech 来研发，一些小公司或者创业公司想做Serverless 基础设施基本上是不太可能的，因为，Serverless 最核心竞争优势不仅仅前面的函数，更重要的是服务商本身所提供其他的能力可以供函数调用。

### 3）实时数据处理场景

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLxiagibqg2zNLdkeloWhxp8erm11dicAjv97p0CQTHibyc5mcWXHD54YHNA/640?wx_fmt=png)

第三类场景：实时数据处理，最典型的就是物联网应用，数据量非常大，用 Serverless 也是非常匹配。假如需要 1万 QPS ，函数可以立马生成支持 1万 QPS 的集群，如果你自己搭一个 EC 2 服务器或者是其他应用的话，还需要自己去管理集群，成本会变得很大。

### 4）AaaS 认证即服务场景

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDL1cLgLoYSPLbXRdvEIsUsib0DFcgGX7Zehnrl65lmFm3kyNuV00QBACQ/640?wx_fmt=png)

那么还有一类最不容忽视的一个场景是：AaaS （Authentication as a Service：认证即服务），把用户注册、登录、用户管理、认证及授权等模块 SaaS 服务化。为什么需要 AaaS 这类服务呢？主要有三点原因：

第一点：身份管理，是云计算里面除了计算资源、存储资源和网络资源之外，最标准化的一个产品。为什么说最标准化？前面 IaaS 图中可以看到：Stack Components 包含了注册、登录、注册、用户管理以及认证和授权模块，基本上所有的应用：不管 是to B、to C、to G、to Developer 基本上都是需要的且流程非常标准；甚至在基础设施层面的服务，也都需要标准化的认证服务，比如：K8S 容器编排场景中，也都有认证/授权这种需求，另外在多云管理、DevOps 不同工具流身份的管理等。

在没有 AaaS 云服务之前，大家都需要自己造的轮子，那么 AaaS 云服务的出现就让这种重复造轮子的事情不在发生，节省巨大的社会生产力，并且让身份管理变得非常简单安全。这个也是很多的厂商都看到的这样一个机会。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLspeBNvFS1AFvSAg7Thsmpbv0PuIDRMvfVQCsCpIEoCwFTnHySB7DlQ/640?wx_fmt=png)

第二点：身份管理问题在数十年间，从未得到一个很好的解决，用户以自己隐私代价来为企业「身份管理不善」买单。比如很多站点的用户数据泄露事故，这些用户泄露事故不仅给企业的名声造成很大的影响，而且，严重损害了用户的隐私。近期了解到的一家公司每年花几百万来购买身份管理服务。AaaS云服务产品的出现，将大大降低客户的投入成本及安全成本。

第三点：合规成本逐年上升：随着 GDPR、CCPA 、包括加拿大的 Castle 等，这些法律出台之后，政府对于企业在身份管理方面提出了更高的要求。假如企业要去满足这些要求，会花费巨大的成本，而使用AaaS 云服务，就可以保证企业可以非常高效、简单、安全的拥有一个合规身份管理产品。

## 3. Serverless 使用报告

接下来看一个 Serverless 使用报告，一起来了解产业现状，数据来源于O’Reilly serverless survey 2019。

首先是 40% 的企业已经采用了 Serverless，这个占比还是比较大的，60% 没有采用，市场空间还是有很大的提升空间。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLJsxbCicstBXxe00dDVeGjAVN49348INhiazpvoPEd7FPfB9VW8IiapONw/640?wx_fmt=png)

30% 的 Serverless 用户是一线工程师，然后是架构师、技术 leader 占 25%左右；还有技术类的也不少，另外一个出乎我意料的是：VP、总监、经理级别的用户也近20%；

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLhBClXssl8GTdldVYwFGGibq0Wd6xec3C0NLQlk16KWOauTAryO3ETKQ/640?wx_fmt=png)

另外报告显示，采纳 Serverless 技术的行业也非常广泛，采用最多的是软件行业，第二大是金融及银行业，第三大行业是咨询行业。所以如果要在 Serverless 领域创业的话，可能最好的客户是金融业，要么做外包，要么服务金融业。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLz5xPJYTx70QhAKWmHdv56MVXlK9gbN6rqjlOG8FdmicyAGRo2bMEXyA/640?wx_fmt=png)

60% 的中大型规模企业采纳 Serverless：这个数字也是比较出乎意料，我们潜意识觉得采用 Serverless 新技术的可能都是小企业，但是从图中可以看到，其中一万人以上规模的公司，占到了 20%。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLVb7rbia0wwEIBzvH3dloUjHX1yDZWaqGBzmxUyG8lWAslCAlR3hocuw/640?wx_fmt=png)

50%的 Serverless 用户，以经常使用 Serverless 超过一年时间，采用 Serverless 技术超过三年时间的企业也超过了10%

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLeCY6RAV4pCqo77RU8Dl9FOaiab1hWOVxsqAQah0Sus9t3xWib0zqcwOw/640?wx_fmt=png)

然后 66% 的用户表示，采用 Serverless 技术后效果显著。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLUkSRTnHDYPjYhW42JgicX39cw1Mw8K96d3oJjKLYuBTnm40cJRlDibHg/640?wx_fmt=png)

这是为什么要使用 Serverless 的一些调查。我们看前三个最主要的几个理由，分别是减少运营成本、可以按序的自动的伸缩。第3个是不需要再关心服务器的维护问题，和第一点差不多，降低成本。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLNwTeCsIdMqjbvcrZ4N1sCBDJU3672oMWGZsKSIxibYUDRR6lGZEK4Tg/640?wx_fmt=png)

为什么不用 Serverless 的原因调查显示：

- 企业在采纳 Serverless 技术之后面临最大的挑战是：对于当下员工的教育成本很高，去教育员工还是比较难的，所以如果说要在 Serverless 领域创业的话，能做一家Serverless 领域的咨询公司也不错，与教育机构合作培训人才。
- 第二大挑战是因为 Serverless 领域缺乏标准，很容易被供应商锁定，不容易迁移到其他供应商，这个可能需要加快推动 Serverless 行业的标准化进程，防止被供应商锁定，现在 CNCF 基金会也在推动着这个事情。第三大挑战是集成测试、调试非常困难，这也反映了 Serverless 生态供应链的不健全问题，同样，也存在创业机会。
- 不采用 Serverless 最大的原因是：考虑到安全问题。如果要创业的话，那么去解决 Serverless 的安全性问题也是一个很大的机会。第二大原因是：因为对于 Serverless 的未知而产生的畏难情绪，不知道使用了 Serverless 会发生什么的问题。第 3 个原因是：底层云服务商正在迁移中，来不及采用 Serverless。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDL4w7RNRaFCOdwGUsouFof889CK94coW8LMTeDN8nibPyP5WoDKDX11Vw/640?wx_fmt=png)

什么角色在管理公司内部 Serverless 的基础设施？首先是负责DevOps 的运营人员，第二是：软件工程师、第三是技术架构师。这个是一个全球调查，我认为和中国的实际情况可能不太吻合，中国可能要反过来，第一可能是架构师来决定。第二是具有话语权的软件工程师来决定是否采纳。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLOQfMSibm5VD9esolMUDGVu4uuVQ9ex89y0AGHtubzDNKcbFVLRlnn6A/640?wx_fmt=png)

最后一个调查显示：50%+ 的企业愿意在未来三年尝试 Serverless，所以说 Serverless 在未来还会有一个非常大的增长。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLhczB9BN01JqLSDHM0cl5Os4gG0yHicJDDtlhAqnFncE314MyWuLcKGw/640?wx_fmt=png)



## 4. Serverless 工具链、前景和机会

最后的话我们来聊一下，Serverless 工具链、前景和机会。首先我们来看工具链，分为三个版块，分别是开发、部署、监控。

### 1）开发工具

第一是 CLI 工具：主要是兼容商业 FaaS 以及开源的 FaaS ，Servereless.com 做的非常不错了，他们已经兼容了十几种 FaaS 平台。

第二是编辑器的插件：现在很多程序员还是习惯使用 VS Code 或者 Sublime 之类的工具进行开发的，所以需要一个非常方便的插件，可以便于管理、调试。

第三是 WebIDE：WebIDE 是一个衍生品，主要是作为方便去开发、调试的小工具，大多数开发者应该还是会基于本地的编辑器插件来开发。

此外，可能还有一些其它工具有待于补充。

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLphOsLLVic26bHibpaxhOA3TrFBz36lwkXxhiaOa4PSPHSc9QrNzRweA1w/640?wx_fmt=png)

### 2）部署工具

常用的部署部署工具包括：Git 集成、CI/CD 持续集成、Hooks （用于同步消息到 IM 工具）等。那么还需要做一些 Cronjob ，比如说能够非常方便的部署定时任务，并且我能够发布预览版和生产版。

### 3）监控工具

最后我们需要 monitor 来报警，需要短信通知、公司邮件通知，还需要日志等。

我说的这三点其实只是产品层面的一些小打小闹，有没有这些功能，对 Serverless 的普及和产业的提高并没有太大的影响。我觉得如果要真正促进 Serverless 发展的话，还需要做以下三件事情。

## 5. 三个能促进产业发展的机会

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLWXHdJhVjLlzia8B5qqX0B4JhxLNk8Otx5o5DHIzVZ7rw7icJlAr7iaA1A/640?wx_fmt=png)

第一件事情是有一个 FaaS Framework 专门用来编写大型项目，同时他是完全兼容 FaaS 架构的。为什么需要 FaaS Framework 呢？如果没有 FaaS Framework 的话，我们是没有办法用 FaaS 编写大型项目的。一个函数，只能做一些简单的事情，假如说需要做一个QQ，做一个微信，一个函数是肯定不行的。

第二件事是 Content as a Service，CaaS 是 FaaS 本身的更高层级的抽象，FaaS 是提供计算能力，然后最重要的其实还是需要一个存储能力，尤其是结构化数据存储，那么就需要一个 CaaS 将存储云化。比如我我的 CaaS 平台去设计一些表和字段，然后这些字段中间还可以互相连接，最后他可以马上帮我我生成 REST API 或 GraphQL 等，并且它还有和 FaaS 结合的能力，我觉得它是未来一个很大的机会。

第三类就叫做云原生编程语言。这种编程语言的话，它完全是架构在现有的云计算厂商上去的，它的逻辑循环是不变的。但是他对硬盘的读写是在云上，并且它兼容各大云平台，比如说我要调用 AWS 的S3，我只需要写原生编程语言就可以，不需要去使用任何的框架，同时它可以启动云上的服务器进行调试。他从语言层面就是一个可伸缩的，比如说我我写了一个 1+1=2 这样一个计算，假如有一亿请求过来，那么在他语言层面就可以帮我调度可以抵抗一亿流量的计算资源。

我觉得如果说这三件事情做好的话，能对整个产业有一个巨大的促进作用。

## 6. 总结

![img](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLGiaM7PcoMvoPkLFndntQys8ft1v1WUNMPq5M6DhqBWBlIwQG2JrpDMw/640?wx_fmt=png)

最后总结一下，Serverless 是真正的云计算，它真的是按需付费，然后不需要去自己去管理任何的基础设施，只需要关注自己的核心业务，目前的云计算还没有真正做到这一点。然后小公司做 Serverlss 的话基本上没戏，主要原因是缺乏信任。

如果是创业公司的话，可以从以下几个层面切入。

- 第一是做一个 FaaS 聚合器提升开发便捷度，就像 Serverless.com 做的事情一样，
- 第二就是做一个 FaaS 没然后接外包，这种大型的外包业务能用 Serverless 来做最好。
- 第三是开发一个 CaaS 然后覆盖查询业务，然后再通过和 FaaS 打通，进而完成一些高阶操作，进而赋能业务。
- 第四个是开发云原生变成语言，然后与教育机构、培训机构、咨询机构合作，培养人才，人才有了这个意识之后，整个产业才能有一个更大的改变。

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
