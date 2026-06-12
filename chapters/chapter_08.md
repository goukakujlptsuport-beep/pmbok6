# 8 Schedule

## Introduction

Planning a project schedule and the overall process of schedule management primarily relies on technical project management skills. How do you manage a project schedule? For this question, many people immediately think about software or a Gantt chart. Yes, software is a valuable tool. It can save time with scheduling, analyzing what-if scenarios, performing status reporting, and other things. But you need to understand the details behind the data.

This chapter, along with additional exercises on the RMC Resources page (rmcls.com/rmc-resources), will help you thoroughly understand the process of planning and managing a project schedule. Historically, exam questions related to scheduling have required the knowledge of how to draw a network diagram. Agile questions may require you to know how to build a story map.

Although the process to plan and manage a schedule is straightforward, you need to know options for developing and compressing a project schedule. A project schedule must be realistic before the work to build the product begins. For the exam, assume you have the authority and responsibility to create a realistic schedule. The exam is written with this assumption although it is not always true in real life.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//06d89144-ee28-437e-a78d-747f92f7bf29/markdown_2/imgs/img_in_image_box_518_311_631_423.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A50%3A20Z%2F-1%2F%2F0c8111f6db08b5a125ee710227a482b215e72f48a7966b5db68974a42fb78643" alt="Image" width="13%" /></div>


RMC RESOURCES

#### Definitions Related to Plan and Manage Schedule

This is some basic estimating and schedule-related vocabulary that will be used in upcoming sections, where we will cover each concept in more detail.

#### Dependencies

Dependencies are logical relationships between activities in a project. The most obvious dependency example is: "Activity A must be completed before activity B can start." There are other types of dependencies, which are covered later in this chapter.

#### Float

Float represents schedule flexibility. Most simply, float is the amount of time an activity can be delayed without delaying the end date of the project. The definition in practice is a little more involved than this, however. There are several different types of float, which are covered later in this chapter.

#### Leads and Lags

A lead may be used to indicate that an activity can start before its predecessor activity is completed. For example, web page design might be able to start five days before the database design is finished. A lag is waiting time inserted between activities. For example, a three-day lag time after pouring concrete is needed before constructing the frame for a building.

#### Critical Path

The critical path is the shortest path to finishing the project. Projects are complex and have many workstreams. The critical path is important because it is the one workstream that has no float (schedule flexibility). Since the critical path has no float, any activity along it that is finished late represents a risk of the project finishing late.

### QUICKTEST

• Dependencies

• Float

• Leads and lags

• Critical path

• Milestone

• Schedule model

• Schedule Management process

• Schedule management plan

• Precedence diagramming method (PDM)

• Dependencies

Mandatory

- Discretionary

- External

#### com/rmetresources

• Network diagram

• Analogous estimating

• Bottom-up estimating

• Parametric estimating

• Single-point estimating

• Three-point estimating

- Triangular distribution

Beta distribution

• Activity standard deviation

• Affinity estimating

• T-shirt sizing

• Planning Poker

• Alternative analysis

• Reserve analysis

• Contingency reserves

• Management reserves

• Fist of five

• Basis of estimates

• Critical path method

• Fast tracking

• Crashing

• Monte Carlo analysis

• Resource leveling

• Resource smoothing

• Agile release planning

• Cumulative flow diagram

• Velocity

• Project schedule

• Milestone chart

• Bar chart

• Schedule baseline

• Reestimating

189

Schedule

EIGHT

##### Milestones

Identified points in the project schedule where particular objectives should be met are called milestones. They are not work activities and have no duration but they do fall on certain dates. Initial milestones are documented in the project charter. The project manager can also insert milestones as checkpoints to help control the project. A milestone list is a project document, often created as an abbreviated view of the schedule. If a milestone in the schedule is reached and any of the planned work is not complete, the project is not progressing as planned, i.e., the project is behind schedule.

Examples A completed design, a company-required checkpoint, a phase gate, or an iteration completion point.

##### Schedule Model

The schedule is always a model of sorts because it is subject to changes based on constant monitoring and controlling of the project. The project calendar (or schedule), plus all the associated planning documents is referred to as the schedule model. At first it is a working model of the schedule, along with artifacts like the activity attributes and estimates and the project schedule network diagram (once it is created). An agile equivalent would include the release map and other release planning artifacts, the prioritized backlog plus the current iteration plan.

As the project schedule is approved the schedule model becomes the current approved version of the schedule along with these other schedule-related artifacts. For both agile and plan-driven approaches the project's historical planned and actual results data and analyses inform the current schedule model.

#### Schedule Process Overview

As with all project management processes, you will need to understand how to plan and manage the project schedule from several perspectives. The Schedule Management process from the Process Groups model is one way to speak about project scheduling, and the Plan and Manage Schedule task in the Process domain of the Examination Content Outline (ECO) is another. Remember that while much of the Process Groups model can be applied to any project life cycle and development approach, agile has its own methods and practices. You will also want to understand agile scheduling practices, and how they are similar and how they are the different from plan-driven practices.

##### The Examination Content Outline and Process Groups Model

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//06d89144-ee28-437e-a78d-747f92f7bf29/markdown_3/imgs/img_in_image_box_70_595_115_649.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A50%3A21Z%2F-1%2F%2Ff076de1dd1ef3ea246f3bbd0c2e40c120d557cb52123ed4830b8277091fe960c" alt="Image" width="5%" /></div>


Think About It. Take time now with the ECO and the following diagram to think through the Process Groups model's Schedule Management process as it relates to the Plan and Manage Schedule task from the ECO's domain I (Process).

• In the Process Groups model, these are all planning functions:

☐ Define activities

☐ Sequence activities

☐ Estimate activity durations

• Then you are ready to develop the schedule—also a planning function.

- Throughout the project you are using earned value measurement (EVM) to control the schedule (including procurement schedules) and manage changes to it. EVM is covered in more detail in "Budget and Resources," as it is used for tracking progress on scope, schedule, and cost together.

190

EIGHT

Schedule

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//06d89144-ee28-437e-a78d-747f92f7bf29/markdown_4/imgs/img_in_image_box_41_100_742_308.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A50%3A21Z%2F-1%2F%2Fa583b7bd30f7e44eb70c50c6ed1f770ee5b148186cbebf7e12dc4fab938063aa" alt="Image" width="85%" /></div>


Can you see how other ECO tasks support Plan and Manage Schedule? For example, supporting ECO processes are Manage Conflict and Negotiate Project Agreements (People domain I, tasks 1 and 8). Also think about the supporting roles of Promote Team Performance through the Application of Emotional Intelligence, and Ensure Team Members/Stakeholders Are Adequately Trained (People domain I, tasks 14 and 5). Think systematically as you review the ECO. Other ECO tasks also often play a role in planning and managing the project schedule.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//06d89144-ee28-437e-a78d-747f92f7bf29/markdown_4/imgs/img_in_image_box_121_441_650_808.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A50%3A21Z%2F-1%2F%2F69b5c3b0c94318ee84b8a984bee8a38760b9a286f1c7ebbd3b08f681e51e316f" alt="Image" width="64%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.1 Schedule management process</div> </div>


#### Desired Outcomes of Schedule Management

For the exam, unless the question indicates otherwise, assume that schedule management has been properly planned according to the concepts presented in this chapter related to planning and managing the schedule. Having a plan means that when a problem arises the first option is to look to the plan for how to handle it. The following should be expected of a properly planned and managed project:

191

Schedule

EIGHT

• All or most deliverables are completed and delivered in the planned timeframes, within budget and with the agreed quality attributes.

• The number of changes to the project and product requirements are within the project manager and team's expectations.

✓ More changes are expected on agile projects than on plan-driven projects. Negotiating scope to keep the project on schedule on agile projects is also expected as scope is understood to be the more flexible constraint.

✓ A significant number of changes to requirements on plan-driven projects should be evaluated for possible issues with stakeholders or the clarity of the scope and requirements definitions.

• Stakeholder behaviors and relationships indicate project outputs are largely accepted and stakeholders seem satisfied at a given point.

- The cadence of development, testing, and implementation is appropriate to the specific project and to the development approach and life cycle selected.

• Measurements indicate the project is performing as planned. Reviewing past forecasts against present project performance indicates the project is largely or wholly on schedule.

- Project benefits can be realized in the timeframe they were planned for.

#### Plan Schedule Management

The Plan Schedule Management process involves documenting how you will plan, manage, and control the project to the schedule baseline, and how you will manage schedule variances. You also need to determine in advance and ensure a common understanding about:

Process Groups Model

PG: Planning

• What the measures of performance will be

• How and when to capture data to evaluate performance

Process: Plan Schedule Management

• How you will use the data to keep the project on track

ECO

Domain II

• What you will do when variances occur

Task 6 Plan and manage schedule

PMBOK Guide

Plan Schedule Management answers questions such as:

Domain 2.4 Planning

• Who will be involved, and what approach will be taken to plan the schedule for the project.

• What processes and procedures will be used to create the schedule?

Did you remember that hybrid and agile approaches take a more short-term view of scope and schedule than traditional approaches? Teams form a general plan and then schedule and perform project work in iterations. They then re-evaluate to determine the next best steps based on actual progress. Agile teams also continually refine the schedule as new details emerge. This approach is best when trying something new. When the work is new and scope is emerging rather than stable, discovery is a better guide for progress than detail.

When work and environments are familiar and predictable, it is possible to accurately schedule work in advance. A hybrid approach uses traditional scheduling methods in some areas of the project while using agile methods in others.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//844f4eee-980a-454b-9939-9c757b6da53b/markdown_0/imgs/img_in_image_box_670_657_717_712.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A02Z%2F-1%2F%2F89dace700fcaabd7528a62e735fe8d6e1275f6529ff079d13ce83cb72b44014c" alt="Image" width="5%" /></div>


Example A traditional approach is typically used to build an office building. A realistic hybrid option is to start and finish the building's most durable aspects using a traditional approach, and then customizing the inside spaces iteratively as office space is leased.

To plan the projects' schedule, the project manager will also need to:

• Review the project charter

• Use expert judgment

• Use data analysis techniques, such as alternatives analysis

• Hold meetings that include the:

y project sponsor

y team members

y other stakeholders

192

EIGHT

Schedule

The project life cycle and development approach agreed on in Develop Project Management Plan (an Integration process) will influence the level and type of schedule management planning the project manager does. They may also consider using or creating enterprise environmental factors, such as:

• A work authorization system for the project

• A preferred project management scheduling software, which the organization may already have

• The impact of the company culture and overall structure on the project schedule

Schedule Management Plan What is the key output of this process? A formal or informal schedule management plan (part of the project management plan). It helps make estimating and schedule development faster by specifying the following:

• Scheduling methodology and software

• Rules for how estimates will be stated (Examples: hours, days, story points)

• How schedule variances will be managed

• Whether to state both effort and duration

• Performance measures that will help identify variances early

• How a schedule baseline to measure against will be stated

• Estimates for where changes may occur

• Acceptable variance threshold (s)

- A process for determining whether a variance must be acted on

• Change control procedures

• Types, formats, and frequency of reports needed

• Length of iterations and releases for agile

#### Define Activities

The Define Activities process involves doing the following for the work packages created in the WBS (created as part of Plan and Manage Scope):

• Decomposing them into the activities that are required to produce the work packages

• Making sure decomposition is at a level small enough to:

Process Groups Model

y Schedule

x/ Estimate

PG: Planning

y Monitor and control

Process: Define Activities

Domain II

ECO

• Prepare to sequence these activities in the next process

Task 6 Plan and manage schedule

PMBOK $ ^{2} $ Guide

Domain 2.4 Planning

#### The Context for Defining Activities

Project managers often combine the Define Activities effort with creating a WBS and WBS dictionary. The project manager and team decompose work packages into the activities required to produce them, rather than stopping at the work package level. So, what is needed in order to define activities?

- The schedule management plan gives the project manager important information about the agreed scheduling methodology

• The traditional scope baseline (scope statement, WBS, and WBS dictionary), or the project's product backlog for agile projects

• Story cards for agile projects

This is the work the project manager will now break down into project activities. Collaborating with the team helps define activities completely and accurately and later will make the estimates more accurate. The project manager may refer to organizational process assets, including:

• Existing templates.

• Historical information such as:

✓ Activity lists

☑/ Issue lists from other similar projects

• Standards, such as prescribed scheduling methodologies

193

Schedule

EIGHT

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//844f4eee-980a-454b-9939-9c757b6da53b/markdown_2/imgs/img_in_image_box_95_106_148_159.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A03Z%2F-1%2F%2F19b3bd4ea39f6e00967a69b65dca54c36d5f62255418c2c54b096c496da48813" alt="Image" width="6%" /></div>


While reading exam questions remember to identify: "Where am I in the project management process?" Decomposition is used in schedule, scope, and cost management. When you see the term "decomposition" on the exam, look for context. If deliverables are being decomposed with the team into smaller deliverables (or work packages) the question is referring to the Create WBS process (in scope management) and a predictive. If work packages are being broken down into activities to produce them, the question is referring to Define (for schedule management).

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//844f4eee-980a-454b-9939-9c757b6da53b/markdown_2/imgs/img_in_image_box_95_228_150_281.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A03Z%2F-1%2F%2F216c3bc89cf2514a7ffb2332f26aebf92b83529d9698917ed0a43bc756c8e0d4" alt="Image" width="6%" /></div>


With an agile approach, the team helps to define the activities and the product owner sequences the work by prioritizing stories in the backlog. The team helps identify dependencies, develop estimates, and provide input on what is achievable. Development of the schedule is a joint effort.

#### Sequencing Activities

Once work package activities are defined, the next process involves sequencing them in the order in which the work should be performed. The result is a project schedule network diagram. A simple network diagram is illustrated in figure 8.2. There is practice work designed to help you learn how to draw and interpret network diagrams later in this chapter.

PG: Planning

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//844f4eee-980a-454b-9939-9c757b6da53b/markdown_2/imgs/img_in_image_box_169_441_502_518.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A03Z%2F-1%2F%2F7122cf46eb1d5f659cc869278f494d97bd14b76f0c247c6c678d82c43bebfdd4" alt="Image" width="40%" /></div>


Process Groups Model

Process: Sequence Activities

<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.2 Network diagram</div> </div>


ECO

Domain II

Task 6 Plan and manage schedule

PMBOK® Guide

Domain 2.4 Planning

For the exam, know this about a network diagram:

• In its simplest form, it just shows dependencies between activities.

- If activity duration estimates and leads and lags are added to the diagram, it can also show the critical path, which is the shortest path to finishing the project.

• If plotted out against time (is made calendar-based), the network diagram is a time-scaled schedule network diagram.

Inputs that may influence dependencies in the sequencing of activities include the:

• Assumption log

• Activity list

• Activity attributes

• Milestone list

#### Precedence Diagramming Method (PDM)

This method uses nodes (or boxes) to represent activities, and arrows to show dependencies. In figure 8.3, for example, activity B is dependent on the completion of activity A.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//844f4eee-980a-454b-9939-9c757b6da53b/markdown_2/imgs/img_in_image_box_298_871_512_935.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A03Z%2F-1%2F%2F7d8298b94f55a3e49fe6fda9ce421152bbd9725f57ec069bde7efcbd150484a0" alt="Image" width="26%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.3 Precedence diagramming method</div> </div>


194

EIGHT

Schedule

#### Logical Relationships

There can be four types of logical relationships between activities, as shown in figure 8.4.

• Finish-to-start (FS) An activity must finish before the successor can start. This is the most commonly used relationship. Example: You must finish digging a hole before you can start the next activity of planting a tree.

• Start-to-start (SS) An activity must start before the successor can start. Example: You must start designing and wait for two weeks' lag in order to have enough of the design completed to start coding.

- Finish-to-finish (FF) An activity must finish before the successor can finish. Example: You must finish testing before you can finish documentation.

• Start-to-finish (SF) An activity must start before the successor can finish. This dependency is rarely used. An example of this type is, “The first shift security guard cannot leave until the second shift security guard arrives.”

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//844f4eee-980a-454b-9939-9c757b6da53b/markdown_3/imgs/img_in_image_box_253_305_532_461.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A03Z%2F-1%2F%2F2f9f027aee414b34d5cc48264d89e90f63fcd4758395f2e6257e23ed170aa8e1" alt="Image" width="33%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.4 Finish-to-start, start-to-start, and finish-to-finish dependencies</div> </div>


#### Types of Dependencies

The sequence of activities is also determined based on these dependencies:

• Mandatory dependency (hard logic) A mandatory dependency is inherent in the nature of the work or is required by a contract. Example: You must design before you can construct.

- Discretionary dependency (preferred, preferential, or soft logic) This means there are other ways it could be done, but this is the approach the organization has chosen to perform the work. Discretionary dependencies are the most flexible type, and they are important when analyzing how to compress the schedule to decrease the project duration (i.e., to fast track it).

• External dependency This type of dependency is based on the factors relating to a party outside the project (for example, government or suppliers).

- Internal dependency This type of dependency is based on needs internal to the project and may be something the project team can control.

More than one dependency can be identified for the same work. Combinations include:

• Mandatory external

• Discretionary external

• Mandatory internal

• Discretionary internal

#### Dependencies in Hybrid Environments

Digital products have different characteristics than traditional, physical products. Consider how a contractor builds a house. They wouldn't complete the interior of the house before they built the roof, would they? Of course not. The roof needs the walls, the walls need a foundation, and the foundation needs land and permits in place. The dependencies are static, well understood, and slow to change. Techniques like network diagrams, critical path analysis, and detailed Gantt charts are valuable and necessary.

In the digital product space, however, there are many more options and possibilities. Good IT architecture allows services to be swapped out easily and promotes isolating changes. This means there are far fewer dependencies on digital projects. This coupled with more requirements renders much of the traditional dependency analysis and dependency management redundant, unreliable, and wasteful. Therefore, many of these techniques are not used in software-heavy digital projects. Instead, project managers work with product owners to define what the priorities are, and they work with the teams on how best to build them. Typically, features can be implemented and evaluated independently of each other.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//844f4eee-980a-454b-9939-9c757b6da53b/markdown_3/imgs/img_in_image_box_682_826_730_882.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A03Z%2F-1%2F%2Fba2e3360b9d62ca37595115dff9950ba28e40b1e648020811f555ea40c70c3e1" alt="Image" width="5%" /></div>


195

Schedule

For example, using a hybrid approach to build an energy trading system for an electrical operator, the product owner may use a traditional approach to create an initial sequence of features to be developed. Then they may reorder the remaining features once the initial product is in place. The product owner may reorder these features again after the regulatory body responses get integrated, and again later as additional features come on board. This would all require extensive schedule rework with traditional network diagrams and Gantt charts. By comparison, reordering the backlog at this stage of a hybrid project is much less work.

#### Project Schedule Network Diagram

A schedule network diagram is an artifact of planning and managing the project schedule. It is an illustration depicting the flow of project activities in the logical order in which they will be performed (see figure 8.11). Here are some guidelines to understand about schedule network diagrams:

- The project manager needs the activities list and to know the dependencies between activities. Later, after they have all the duration estimates for each activity, they can add that data to the network diagram.

- All activities after the Start should be connected to at least one predecessor activity (except the first one in each workstream after Start).

• All activities on the network diagram before the Finish should be connected to at least one successor activity.

- The network diagram helps the project manager plan which activities can be completed in parallel and to see where leads or lags are required.

• The more complex the project, the more likely it is that activities will overlap.

• Path convergence An activity having two or more activities directly preceding it on different paths is referred to as path convergence.

• Path divergence An activity having two or more successor activities directly following it on different paths is referred to as path divergence.

• Both path convergence and divergence are indicators of risk within the impacted activities.

Example Using the simple example in figure 8.2, here is how to build a network diagram.

1. Put <Start> and <End> in shapes that distinguish them from the nodes (named activities).

2. From <Start>, create the first rectangle and label it Activity A.

3. Draw a line from Activity A and add another node, labeling this second node Activity B. The line indicates a dependency connection between the two

4. Draw a line from Activity B and add another node, labeling this third node Activity C.

5. Add an <End> and draw a line from Activity C to <End>.

6. Repeat the process to add the second path (add Activities D and E; add lines between them and then a line to <End>. The network diagram is ready for the activity duration estimate data.

Complex project schedule network diagrams that include leads and lags as well as other dependencies are best done with an automated scheduling system that is part of the PMIS. You will be expected to answer questions on the exam related to interpreting information these diagrams provide. You need to have worked with network diagrams to accurately answer such questions.

In summary, network diagrams can be used to:

• Help justify the project manager's time estimate for the project.

• Aid in effectively planning, organizing, and controlling the project.

• Show interdependencies of all activities, and thereby identify riskier activities.

• Show workflow so the team will know what activities need to happen in a specific sequence.

- Identify opportunities to compress the schedule in planning and throughout the life of the project (explained later in this chapter).

- Show project progress and help with forecasting. This is used for controlling the schedule and reporting, and is related to earned value measurement (EVM). EVM is related to scope, schedule, and cost, and is covered in the “Budget and Resources” chapter.

196

EIGHT

Schedule

#### Estimating Activity Durations

When the activities have been defined and sequenced, the next step is to estimate how long each activity will take. This is the Estimate Activity Durations process. When possible, estimators should be those who will be doing the work, or on large projects, members of the project management team most familiar with the specific work to be done.

Both the Estimate Activity Durations and Estimate Costs (in the “Budget and Resources” chapter) processes involve estimating. Historically, the exam has focused on the methods required to produce good estimates more than on calculations.

Use this checklist to evaluate your understanding of activity and schedule estimating. Identify gaps that may impact how you answer exam questions. Keep track of items you currently do not do in your project work and pay extra attention to Process Groups Model

PG: Planning

Process: Estimate Activity Durations

ECO

Domain II

Task 6 Plan and manage schedule

PMBOKE Guide

Domain 2.4 Planning

studying these topics. Remember, bad project management practices (like padding estimates, for example) may be listed as choices on the exam.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//60b4aefd-840d-4c51-a5b9-bc33a9953916/markdown_0/imgs/img_in_image_box_48_380_99_439.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A51Z%2F-1%2F%2F03dd36b5f60790ac729e33f1dcbd8bd7c120e2fc84e4011d1b87ce48530b8cea" alt="Image" width="6%" /></div>


#### Think About It. Things to Know About Estimating for the Exam

Management plans provide the approach to estimating.

DThe project manager and team may use one or many techniques to estimate project work.

Estimating should be based on small amounts of work, from a WBS or from story cards in agile. This improves accuracy.

Duration, cost, and resource estimates are interrelated. Duration and resource estimates often impact cost estimates.

Identified risks must be considered when estimating the duration, cost, and resource requirements of project

work. Risk management actions are specific line items in a project contingency reserve (part of the budget). For agile risk management actions are represented as stories in the backlog.

Estimating duration, cost, and resource requirements may uncover additional risks.

Estimating should be done by those doing the work or those most familiar with it to improve accuracy.

Historical information from past projects (part of organizational process assets) is often key to getting started and improving estimates.

Estimates are more accurate on smaller-size work components.

A project manager doesn't just accept management-given constraints. They evaluate project requirements, develop estimates with the team and reconcile differences, producing a realistic plan.

The project manager may periodically recalculate the estimate to complete (ETC) for the project to ensure adequate time, funds, and resources for the project (getting needed approved changes). ETC and other project control metrics are discussed in the “Budget and Resources” chapter.

Plans based on estimates should be revised, with approved changes, during completion of the work, as necessary.

There is a process in the project management plan to create the most accurate estimate possible.

Padding estimates is not an acceptable project management practice.

The project manager must meet any agreed-upon estimates.

Estimates (from team members or sellers) must be reviewed to ensure they are reasonable and do not contain padding or unidentified risks.

Estimates must be kept realistic throughout the project by re-estimating periodically as needed.

Estimates can be positively impacted by reducing or eliminating risks.

The project manager has a professional accountability to (with the help of the team) provide estimates that are accurate as feasible, and to maintain the integrity of those estimates throughout the project.

197

Schedule

EIGHT

#### Inputs to Good Activity Estimates

To arrive at realistic time estimates, these individuals need to have access to the following:

Activity List and Activity Attributes The relevant inputs may include the time for required leads or lags between activities, which must be factored in to duration estimates.

Assumption Log Assumptions or constraints that contribute to risk within the activities to be estimated should be found here.

Lessons Learned Register Information relevant to the duration of activities include lessons learned from earlier in the current project or from past, similar projects within the organization.

Resource Breakdown Structure Created in the Estimate Activity Resources process (of Resource Management), the resource breakdown structure shows categories of resources required for the project.

Resource Requirements These requirements indicate the skills needed from resources to perform specific project work.

Project Team Assignments Team assignments should include the number and experience level of individuals who have been committed to the project.

Resource Calendars These calendars provide information on when key resources with specialized skills needed for activities will be available. If the resources are not available within the timeframe of the project, the project manager needs to estimate time for those to allow less experienced resources to do the work.

Risk Register The risk register may include identified threats and/or opportunities that should be reflected in the estimates.

The Knowledge to Avoid Padding A pad is extra time or cost added to an estimate because the estimator does not have enough information or feels insecure in their estimating. It is not a viable way to plan a project. What is wrong with padding? Think about how estimating works on your projects for a moment. Can you see how, if individual team members pad their estimates, the project estimates become increasingly unreliable? In turn, padding undermines the ability to create a realistic schedule and budget.

In cases where the information required to clarify the unknowns is unavailable, the potential need for additional time or funds should be addressed with reserves within the risk management process. Through risk management, uncertainties are turned into identifiable opportunities and threats. Uncertainties then do not remain hidden.

Remember it is a PMI-ism that proper project management has been done unless an exam question indicates otherwise. There is no need for padding when the following is in place in a properly managed project:

• The estimators have a WBS and may even have helped create it.

• They also have a description of each work package (the WBS dictionary) and may have helped create that as well.

• They may even have helped create the activity list from the work packages.

- Three-point estimates can be used, which by averaging the worst-case scenario, the most likely scenario, and the best-case scenario, builds uncertainty into the estimate.

- The estimators know there will be time and cost reserves on the project determined through the risk management process to address identified risks.

198

EIGHT

Schedule

#### How Estimating Is Done

The part of the team doing the estimating may use one or many techniques as identified earlier in the schedule management plan.

First, let's look at the project manager's role in estimating. The project manager's role here is to:

• Provide the team with enough information to properly estimate each activity.

• Let those doing the estimating know how refined their estimates must be.

• Complete a sanity check of the estimates.

• Prevent padding.

• Formulate a reserve (more on this in the “Risks and Issues” chapter).

• Make sure assumptions made during estimating are recorded for later review.

Now let's look at estimating techniques that may be used on a project. We have organized the following two sections into predictive and adaptive estimating techniques. These methods are generally used with these approaches and are likely to appear on the exam in these contexts. However, any variety of these techniques may be used, especially with a hybrid approach.

#### Methods for Predictive Estimating

Traditional projects use the following methods for estimating. Analogous estimating is an example of an estimating practice applicable to both predictive and adaptive approaches.

Analogous Estimating (top-down) Analogous estimating uses expert judgment and historical information to estimate. It can be applicable to time, cost, and resources. It is usually not considered definitive. For example, management or the sponsor might use analogous estimating for high-level estimation while establishing a business case and for project selection. As the project is chartered the project manager may use analogous estimating at the project level, using historical data from past, similar projects. For example, "the last five projects similar to this one each took eight months, so this one should as well." Analogous estimates are refined later during planning.

Analogous estimating can also be used at the activity level if the activity has been done on previous projects and if there is substantial historical data to support accuracy. For example, “This company has created many thousands of programming modules and they have taken an average of X hours so we will use that as a starting point.”

On the other hand, analogous estimates are used when there are little supporting data. For example, “The last two times this activity was done each took three days. Since we have no other data to go on, we will estimate three days and review estimates as we learn more details.”

For the exam, know analogous estimating can be done at various times. It is usually not thought to be definitive but the level of accuracy can also depend on how much analogous data are available and how closely the project or activity matches the historical record.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//60b4aefd-840d-4c51-a5b9-bc33a9953916/markdown_2/imgs/img_in_image_box_54_703_109_757.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A52Z%2F-1%2F%2F3b5359bafd850dc878cedecd578b907ef68e2bb3c84b1ee9f913243dd6251e09" alt="Image" width="6%" /></div>


#### Bottom-up Estimating

This method involves creating detailed estimates for each activity or work package, using an accurate WBS. The individual estimates are then rolled up into control accounts and finally into an overall project estimate. You will see how these estimates roll up into a budget in the “Budget and Resources” chapter.

#### Parametric Estimating

Parametric estimating involves a mathematical equation using data from historical records or other sources, such as industry requirements or standard metrics. The technique analyzes relationships between historical data and other variables to estimate duration or cost. It can be applied to some or all the activities within a project. For example, when estimating activity duration, the estimator may use measures such as time per line of code, time per linear meter, or time per installation. When used in cost estimating, the measures include cost as one of the variables. So the measures would be cost per line of code, cost per linear meter, etc.

199

Schedule

EIGHT

An estimator might create parametric estimates using the following:

Regression Analysis (Scatter Diagram) This diagram tracks two variables to see if they are related; the diagram is then used to create a mathematical formula for future parametric estimating. Figure 8.5 shows an example of a scatter diagram.

Learning Curve (by example): The improved efficiency.

100th room painted will take less time than the first room because of

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//60b4aefd-840d-4c51-a5b9-bc33a9953916/markdown_3/imgs/img_in_chart_box_284_227_569_408.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A53Z%2F-1%2F%2Fecd689b482790fff678053e0fd0f54ad958f853413e827cf399751455cfb5797" alt="Image" width="34%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.5 Regression analysis (scatter diagram)</div> </div>


Single-point Estimating (One-point Estimating)

This type is based on a single estimate; however, it can be problematic. For example, the person doing the estimate may say that an activity will take five weeks. This may be based on expert judgment or historical information, or it could be just a guess.

One-point estimating can have the following negative effects on the project:

• Being limited to making a one-point estimate may encourage people to pad their estimates since it doesn't include best- and worst-case scenarios.

• When a persons one-point estimates turn out flawed—for example an activity takes 15 days instead of an estimated 20, it can make the project estimates and estimators seem unreliable.

• One-point estimating can result in a schedule that no one believes in, thus decreasing buy-in to the project management process.

We can come together to use single numbers for project activity estimates, for example, using a more realistic estimating method like three-point estimating, covered next. For each activity, it is easier to use a single number (of days, for example) to draw a network diagram and find the project's critical path. On the exam, one-point estimates allow for quick calculation (if a question supports that) and demonstrates that you understand concepts such as the critical path.

Three-Point Estimating (a version of multi-point estimating)

Estimates are best given in a range since there is a very small probability of completing a project on exactly any one date. Three-point estimates are the best known of multi-point estimating techniques.

Three-point estimates better account for uncertainty: What could go right (opportunities) and what could go wrong (threats), to help estimators determine an expected range. This way the project manager can better understand the potential variation of the activity estimates.

There are two ways of calculating three-point estimates for the exam, as follows. Memorize these formulas and remember they can be used for both time and cost estimates:

Triangular Distribution (Simple Average) A triangular distribution of the three-point estimates can be calculated using the formula  $ (P + O + M)/3 $. The use of simple averaging gives equal weight to each of the three-point estimates when calculating the expected activity duration or cost. Using this formula, the risks (or the uncertainties, which are the P and O estimates) are considered equally along with the most likely (M) estimate.

200

EIGHT

Schedule

Beta Distribution (Weighted Average) The beta distribution (a weighted average) gives more consideration to the most likely (M) estimate. This method uses the formula  $ (P + 4M + O)/6 $, a weighted average. When a good risk management process is followed, the most likely estimates are more accurate because risk response plans have been developed to deal with identified opportunities and threats that have been factored into the pessimistic and optimistic estimates.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//60b4aefd-840d-4c51-a5b9-bc33a9953916/markdown_4/imgs/img_in_image_box_43_189_94_247.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A53Z%2F-1%2F%2F911e7ffa373ad95ef7448745899d40cc82c78146c63100cb8fbfeab4263563e4" alt="Image" width="6%" /></div>


Think About It. For the exam, know these formulas and how they are applied to estimating.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//60b4aefd-840d-4c51-a5b9-bc33a9953916/markdown_4/imgs/img_in_image_box_242_229_536_296.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A53Z%2F-1%2F%2Fac72df6ea1b0350e58bcbbaa5a5ebff2eed1898a8d102031fc4c3c323ba5902d" alt="Image" width="35%" /></div>


Legend: P = Pessimistic, M = Most likely, 0 = Optimistic

<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.6 Three-point estimating formulas</div> </div>


<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//60b4aefd-840d-4c51-a5b9-bc33a9953916/markdown_4/imgs/img_in_image_box_49_368_105_422.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A53Z%2F-1%2F%2F2fe1c5b8a61451857ccd764d85e216a8949b164b431eb9cb66dd43925b63fd22" alt="Image" width="6%" /></div>


If you are asked to calculate the activity duration or cost, read the situation carefully to determine which formula to use. Terms like "simple" or "straight" refer to triangular distribution. "Weighted" refers to beta distribution. Knowing this will help you choose the correct formula.

You may be asked to perform a calculation or just analyze information to determine which formula is best for the scenario. Use triangular distribution if the scenario indicates that the project manager doesn't have a lot of experience or historical information; it provides a straight average. Use beta distribution when there are historical data or samples to work with. Most of exam questions relating to this are relatively simple and may require assessment but not calculations. But the calculations are not difficult and the following exercises can help you prepare for them. First, review the three-point estimating formulas in figure 8.6.

### 8.1 Exercise (Triangular Distribution)

Calculate the expected activity duration using triangular distribution. You may write the answer here or use your Exercise Notebook. All estimates are in hours.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td colspan="4">Activity P M 0 Expected Duration</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>A</td><td style='text-align: center; word-wrap: break-word;'>47</td><td style='text-align: center; word-wrap: break-word;'>27</td><td style='text-align: center; word-wrap: break-word;'>14</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>B</td><td style='text-align: center; word-wrap: break-word;'>89</td><td style='text-align: center; word-wrap: break-word;'>60</td><td style='text-align: center; word-wrap: break-word;'>41</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>C</td><td style='text-align: center; word-wrap: break-word;'>48</td><td style='text-align: center; word-wrap: break-word;'>44</td><td style='text-align: center; word-wrap: break-word;'>39</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>D</td><td style='text-align: center; word-wrap: break-word;'>42</td><td style='text-align: center; word-wrap: break-word;'>37</td><td style='text-align: center; word-wrap: break-word;'>29</td></tr></table>

<div style="text-align: center;"><div style="text-align: center;">Answer (Triangular Distribution)</div> </div>




<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Activity</td><td style='text-align: center; word-wrap: break-word;'>Expected Duration</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>A</td><td style='text-align: center; word-wrap: break-word;'>29.33</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>B</td><td style='text-align: center; word-wrap: break-word;'>63.33</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>C</td><td style='text-align: center; word-wrap: break-word;'>43.66</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>D</td><td style='text-align: center; word-wrap: break-word;'>36</td></tr></table>

201

Schedule

EIGHT

### 8.2 Exercise (Beta Distribution)

Calculate the expected activity duration using beta distribution. You may write the answer here or use your Exercise Notebook. All estimates are in hours.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td colspan="5">Activity P M 0 Expected Duration</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>A</td><td style='text-align: center; word-wrap: break-word;'>47</td><td style='text-align: center; word-wrap: break-word;'>27</td><td style='text-align: center; word-wrap: break-word;'>14</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>B</td><td style='text-align: center; word-wrap: break-word;'>89</td><td style='text-align: center; word-wrap: break-word;'>60</td><td style='text-align: center; word-wrap: break-word;'>41</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>C</td><td style='text-align: center; word-wrap: break-word;'>48</td><td style='text-align: center; word-wrap: break-word;'>44</td><td style='text-align: center; word-wrap: break-word;'>39</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>D</td><td style='text-align: center; word-wrap: break-word;'>42</td><td style='text-align: center; word-wrap: break-word;'>37</td><td style='text-align: center; word-wrap: break-word;'>29</td><td style='text-align: center; word-wrap: break-word;'></td></tr></table>

<div style="text-align: center;"><div style="text-align: center;">Answer (Beta Distribution)</div> </div>




<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td colspan="2">Activity Expected Duration</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>A</td><td style='text-align: center; word-wrap: break-word;'>28.17</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>B</td><td style='text-align: center; word-wrap: break-word;'>61.67</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>C</td><td style='text-align: center; word-wrap: break-word;'>43.83</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>D</td><td style='text-align: center; word-wrap: break-word;'>36.50</td></tr></table>

Compare the answers using triangular distribution to the answers for the beta distribution. It may seem that the results are not significantly different, but think about it in terms of a cumulative effect with many activities.

Activity Standard Deviation This concept describes a possible range for an estimate.

Example An activity estimate of 30 hours with a standard deviation of  $ \pm 2 $ is expected to take between 28 hours and 32 hours.

Think About It. You won't be asked to calculate "beta activity standard deviation," or (P - O)/6 but interpreting it in a situational question is important. Think through the following so you understand it.

To establish a range for an individual activity estimate using weighted (beta) averaging, you need to know the beta expected activity duration (EAD) and the beta activity standard deviation (SD). The SD is likely to be given. You calculate the range using beta EAD +/- SD.

The start of the range is beta EAD - SD, and the end of the range is beta EAD + SD. Review the following table to see how the information is presented. Keep in mind that the exam scenario may include information for you to do the same evaluation with triangular distribution.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Activity</td><td style='text-align: center; word-wrap: break-word;'>P</td><td style='text-align: center; word-wrap: break-word;'>M</td><td style='text-align: center; word-wrap: break-word;'>0</td><td style='text-align: center; word-wrap: break-word;'>Expected Duration</td><td style='text-align: center; word-wrap: break-word;'>Beta Activity Standard Deviation</td><td style='text-align: center; word-wrap: break-word;'>Range of the Estimate</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>A</td><td style='text-align: center; word-wrap: break-word;'>47</td><td style='text-align: center; word-wrap: break-word;'>27</td><td style='text-align: center; word-wrap: break-word;'>14</td><td style='text-align: center; word-wrap: break-word;'>28.167</td><td style='text-align: center; word-wrap: break-word;'>5.500</td><td style='text-align: center; word-wrap: break-word;'>22.667 to 33.667, or 28.167  $ \pm $ 5.500</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>B</td><td style='text-align: center; word-wrap: break-word;'>89</td><td style='text-align: center; word-wrap: break-word;'>60</td><td style='text-align: center; word-wrap: break-word;'>41</td><td style='text-align: center; word-wrap: break-word;'>61.667</td><td style='text-align: center; word-wrap: break-word;'>8.000</td><td style='text-align: center; word-wrap: break-word;'>53.667 to 69.667, or 61.667  $ \pm $ 8.000</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>C</td><td style='text-align: center; word-wrap: break-word;'>48</td><td style='text-align: center; word-wrap: break-word;'>44</td><td style='text-align: center; word-wrap: break-word;'>39</td><td style='text-align: center; word-wrap: break-word;'>43.833</td><td style='text-align: center; word-wrap: break-word;'>1.500</td><td style='text-align: center; word-wrap: break-word;'>42.333 to 45.333, or 43.833  $ \pm $ 1.500</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>D</td><td style='text-align: center; word-wrap: break-word;'>42</td><td style='text-align: center; word-wrap: break-word;'>37</td><td style='text-align: center; word-wrap: break-word;'>29</td><td style='text-align: center; word-wrap: break-word;'>36.500</td><td style='text-align: center; word-wrap: break-word;'>2.167</td><td style='text-align: center; word-wrap: break-word;'>34.333 to 38.667, or 36.500  $ \pm $ 2.167</td></tr></table>

202

EIGHT

Schedule

Additional points to know:

• Understand that estimates of time (or cost) should be in a range.

- Although there is a standard deviation formula for triangular distribution, it's complicated and is unlikely to be on the exam so we are not showing it here. What you need to remember for the exam is that the greater the standard deviation, the greater the risk.

• The formulas we’ve been discussing relate to activities. The exam concentrates on three-point estimates to find ranges for activity duration and cost estimates. Be prepared to do simple calculations using these formulas

- You may also see beta total project duration used in questions that require you to evaluate the situation rather than do a calculation (Example: The project duration is 35 months plus or minus 3 months). As with an activity, the greater the range for the project, the greater the risk.

• You can use these concepts to better monitor and control projects. The expected durations help you know the potential variances on your project and determine appropriate courses of action.

- You can use estimated ranges and standard deviation to assess risk. Looking back at the table presenting beta standard deviation, which activity has the most risk? The answer is Activity B. It has the widest range and the highest standard deviation, and is therefore likely to have the greatest risk.

#### Methods for Adaptive Estimating

It is worth repeating that while we have organized these sections into predictive and adaptive estimating techniques, any variety of these techniques may be used with approaches from predictive to hybrid to adaptive. For example, although it is common to think about “affinity estimating” in an agile context, categorizing activities on predictive projects into those taking more or less than 40 hours to complete is also a form of affinity estimating.

Adaptive estimating is done in stages, using progressive elaboration. Story collection estimating typically begins with “t-shirt sizing” for the initial plan, which is refined during release and iteration planning, and throughout the project.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//dcbf9dab-1fb5-4a77-b0e2-8b5e6d41b75f/markdown_1/imgs/img_in_image_box_682_454_732_514.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A23Z%2F-1%2F%2F4e646a34d417896f2f0e46c2854e3d096c3eead41964f1efbb7ae46864e490ff" alt="Image" width="6%" /></div>


#### Affinity Estimating

This is a technique where groups of similar items are grouped into collections—i.e., “affinities.” For example, placing user stories into size categories makes it easier to see whether stories with similar estimates are, in fact, comparable in size.

#### T-shirt Sizing

A form of affinity estimating, or grouping like items together, t-shirt sizing is an approach to estimating product features and user stories early in the project. The team is not yet trying to generate thorough estimates. They are aiming for high-level (course-grained) estimates, sufficient to map out the overall project effort.

Here is an example from a project for an online movie service. The team has identified six features:



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>ES</td><td style='text-align: center; word-wrap: break-word;'>S</td><td style='text-align: center; word-wrap: break-word;'>M</td><td style='text-align: center; word-wrap: break-word;'>L</td><td style='text-align: center; word-wrap: break-word;'>XL</td><td style='text-align: center; word-wrap: break-word;'>XXL</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Sort movies by year</td><td style='text-align: center; word-wrap: break-word;'>Rate movies</td><td style='text-align: center; word-wrap: break-word;'>Browse movies</td><td style='text-align: center; word-wrap: break-word;'>Rent movies</td><td style='text-align: center; word-wrap: break-word;'>Sell movies</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>Review movies</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr></table>

##### FIGURE 8.7 Features by t-shirt size

The results of the sizing effort are shown in figure 8.7. As you can see, it's been decided that:

• “Sort movies by year” will require the least effort to build; this is Extra Small.

• Two features that we think will take Medium effort are “Browse movies”; “Review movies.”

• An online shopping cart for “Sell Movies” will require the most effort; this is Extra Large.

• None of these features will require an Extra-Extra-Large effort.

203

Schedule

EIGHT

Once the team has identified the features, they will decompose them into user stories. In figure 8.8, the user story cards are stacked under each column. These user story cards represent the work estimated by the team to be done to build the product.

You can see at a glance what will take the most effort to build ("Sell movies" with 14 user stories) and what will take the least ("Sort movies by year" with 2 user stories).

It also appears that “Rent movies,” which was sized Large, might actually be smaller than “Browse movies” and “Review movies,” which were sized Medium.

However, the team has not yet determined the relative size of the stories. Some of the stories may be very small, and others may be very large. The team has to estimate all the user stories in t-shirt sizes, like they did for the features.

After that, they can also use affinity estimating to ensure the stories in each category are comparable in size. The stories based on t-shirt sizes might look something like figure 8.9.

Now that all the stories have been sized, the team can use the relative sizes of the stories in each feature to refine their t-shirt estimates for each one. For example, let's say they find out that,

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//dcbf9dab-1fb5-4a77-b0e2-8b5e6d41b75f/markdown_2/imgs/img_in_image_box_273_100_748_712.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A24Z%2F-1%2F%2Fc1ec6eb020b87ac38f266ca1b317ecd0b853edbe04b107fdf57f7e831af86bfb" alt="Image" width="57%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.8 Features and user stories</div> </div>


#### Planning Poker $ ^{*} $

<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.9 User stories by t-shirt size</div> </div>


on average, the stories in "Rent movies" are larger than the stories in "Browse movies" or "Review movies." Then "Rent movies" will require more effort than the two Medium features, as originally thought.

Planning Poker $ ^{*} $ is a common and collaborative game using relative sizing. The goal is not to create precise estimates. It aims to help the team quickly and efficiently reach consensus on reasonable estimates. The project can keep moving forward.

Here’s how to play. An agile team gathers to estimate the stories that need to be built. Each player gets a set of cards with the numbers as shown in figure 8.10. Someone reads a story and each player evaluates it for the work effort they think it requires. The estimating process continues as follows.

m

EIGHT

Schedule

Remember these stories are in a backlog that the product owner has prioritized.

1. All at once (to avoid group think), each team member throws down a card (representing a number of story points).

2. The group discusses differences. As they do this, they are discussing the work involved in each story.

3. As needed, they play another estimating round or two before coming to consensus on the number of points assigned to the story.

4. They repeat this for all stories needing estimates.

5. For the project’s first iteration the team estimates how many stories they think they can complete.

6. Once the first iteration is complete, they compare estimated to actual story points completed.

7. The actual number of completed story points is used to select stories for the next iteration.

8. After a few iterations they can average their story points for a working average, or velocity, of story points completed per iteration. They can adjust velocity as appropriate throughout the project.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//dcbf9dab-1fb5-4a77-b0e2-8b5e6d41b75f/markdown_3/imgs/img_in_image_box_254_338_507_456.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A25Z%2F-1%2F%2F937fb5486cc53f53c4378bcf11ac59d26b1e21e3a0ba6e3fd2ec5328df8dd916" alt="Image" width="30%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.10 Planning Poker $ ^{\circledR} $ estimating “game” cards</div> </div>


It is important to note that story points have no value except as measured against other stories in the same project. Be careful if an exam question talks about comparing two team velocities (speed at which they can build stories). Comparing two teams' velocities on two different projects is not relevant or useful.

#### Methods for Data Analysis

The process Estimate Activity Durations uses two forms of data analysis: alternatives analysis and reserve analysis.

#### Alternatives Analysis

When activity estimates are not acceptable within the constraints of the project, alternatives analysis is used to look more closely at the variables that impact the estimates.

Example Comparing options such as outsourcing work versus completing it internally to meet a schedule constraint. Alternatives analysis involves evaluating the impact of each option on project constraints, including cost versus time saved and level of risk. This process will result in the determination of the best approach to complete project work within the constraints.

#### Reserve Analysis

This connects the topics of estimating and risk management. Estimating helps to identify more risks. Risk management reduces uncertainty in time and cost estimates. This is accomplished by evaluating and planning for significant opportunities and threats, including how they will be dealt with if they occur. Risk management saves the project time and money!

As described in the “Risks and Issues” chapter, two types of reserves can be added to the project schedule (and budget): contingency reserves and management reserves.

Contingency Reserves Contingency reserves are allocated in the schedule baseline for identified risks after the Plan Risk Responses process. Significant risks to critical path activities may be managed by allocating a specific amount of schedule reserve. Employing contingency plans using contingency reserves helps keep the project within the schedule baseline.

Management Reserves These are additional funds and time to cover unforeseen risks (or "unknown unknowns") that may impact the ability to meet the schedule. Management reserves are not part of the schedule baseline. They may not be applied at the project manager's discretion. They require approval through the change control system.

205

Schedule

EIGHT

#### Methods for Decision Making

We've said that involving team members in estimating is beneficial because those most familiar with the work have the best understanding of the time required to complete each effort. This and the team's inclusion in decision making increases their buy-in to the resulting schedule. Here are some group decision-making methods that are useful in project estimating - and in many types of decision making. Each are a variation on using voting in decision making.

#### Plurality, Majority, or Unanimity

On plan-driven projects, the project manager may take a simple vote to reach one of these, depending on the circumstances. Take the example of a scheduling decision regarding a small activity that is far into the future of the project and not on the critical path. The project manager may reach this decision with a simple plurality agreement, while one regarding an activity on the critical path in the near future may require a majority or unanimous agreement.

#### Roman Voting

Here people physically show their level of support for a decision with a simple “thumbs up, thumbs down” voting style. “Thumbs sideways” can also be used for those who are not sure of their vote or have misgivings.

#### Fist of Five

This voting technique is commonly used on change-driven projects (and also called "fist to five"). In this variation, a closed fist indicates a zero (no support) and an open fist indicates five (full support). Team members who are not supportive (who showed two or fewer fingers in the vote) share why they are not in support of the option. Voting is repeated until everyone in the group indicates their support by showing at least three fingers.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//dcbf9dab-1fb5-4a77-b0e2-8b5e6d41b75f/markdown_4/imgs/img_in_image_box_712_393_763_452.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A25Z%2F-1%2F%2Fbeb416e6d38eeae8f08cca35e5697b1f63514efcc7bc53c3f4c83dc4245bf31d" alt="Image" width="6%" /></div>


#### Artifacts of Schedule Estimating

When the Estimate Activity Durations process is complete—including risk management processes—the project manager will have estimates, including reserves. Here are summaries of outputs from this process related to both predictive and adaptive projects. These may be already-existing artifacts that are being updated.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//dcbf9dab-1fb5-4a77-b0e2-8b5e6d41b75f/markdown_4/imgs/img_in_image_box_711_527_763_586.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A25Z%2F-1%2F%2F133ab6f09e9696074e3f4cf538671f8828721e354b4a85ede8271110dd874cf8" alt="Image" width="6%" /></div>




<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Predictive Project Outputs</td><td style='text-align: center; word-wrap: break-word;'>Adaptive Project Outputs</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>— Activity attributes</td><td style='text-align: center; word-wrap: break-word;'>— Prioritized backlog of user stories</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>— Assumption log updates</td><td style='text-align: center; word-wrap: break-word;'>— Coarse-grained estimates of user stories</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>— Lessons learned register updates</td><td style='text-align: center; word-wrap: break-word;'>— Release goal focused on customer value</td></tr><tr><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>— Target release date or release number</td></tr></table>

Basis of Estimates Another artifact of estimating activity durations, the basis of estimates, explains how estimates were derived, including assumptions, constraints, what risks were taken into consideration. Basis of estimates also includes the confidence level for the estimates, expressed as a range, such as plus or minus 20% within which the actual project results are expected to fall.

206

EIGHT

Schedule

#### Develop Schedule

Once the network diagram and activity duration estimates are completed—or for agile a release plan, feature and story prioritization in a backlog, and estimates—it is time to create a schedule model. This can be done using a variety of software tools within a PMIS.

For traditional projects, the schedule model is the first schedule rendition and may be updated throughout the project based on approved changes. During the original project planning it is iterated until ready for approval. It is created using project data gathered thus far, including:

• Activities

• Dependencies

• Start dates (for activities without dependencies)

PG: Planning

Process: Develop Schedule

• Leads and lags

Domain II

##### Process Groups Model

ECO

• Duration estimates

Task 6 Plan and manage schedule

PMBOK Guide

Domain 2.4 Planning

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//726e4ffe-bde1-431e-b5c7-6085afc46402/markdown_0/imgs/img_in_image_box_57_356_97_406.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A39Z%2F-1%2F%2F62f56e9a76dc3c226e4a454b6414bdd9d0936b8e998ecd76c381a39b7f142501" alt="Image" width="4%" /></div>


Think About It. Representations of the schedule include milestone charts and bar charts (as often shown through Gantt chart view in project management software). Once approved, the schedule becomes part of the projects' baseline (which is part of the project management plan). It is calendar-based, comprehensive, and realistic. Inherent in it are contingency reserves to manage risk. Consider what creating a schedule model involves.

Let's start at the beginning. What do you need before you can develop a schedule for your project? To develop a schedule, you need to have:

• Historical records of previous, similar projects including lessons learned

• Schedule management plan and scope baseline

• Defined activities (activity list and attributes)

• Resource requirements estimates

• Milestone list

• Activity duration estimates

• Assumption log

• Resource calendars

• The order in which the work will be done (network diagram)

• The required resources by category (resource breakdown structure)

• Basis of estimates

• A company calendar identifying working and nonworking days

• Already existing project team assignments list

• Risk register

### 8.3 Exercise

As a project manager, you need to use the estimating data and other inputs to create a schedule that you will be able to stake your reputation on meeting. What do you need to do to create such a schedule? Write the answer in your Exercise Notebook.

207

Schedule

EIGHT

#### Answer

The Develop Schedule process really includes everything you need to do to develop a finalized schedule that is bought into, approved, realistic, and formal. This is what developing the schedule is all about. What do you need to do to get it to that level?

• Work with stakeholders' priorities.

• Look for alternative ways to complete the work.

• Look for impacts on other projects and on operations.

• Take into consideration the skill levels and availability of known resources assigned to the team.

• Apply leads and lags to the schedule.

• Compress the schedule by crashing, fast tracking, and reestimating.

- Adjust components of the project management plan as necessary (for example, change the WBS to reflect planned risk responses).

• Input the data into a scheduling tool and perform calculations to determine the optimum schedule.

• Simulate the project using Monte Carlo and other analysis techniques to determine the likelihood of completing the project as scheduled.

• Optimize resources if necessary.

- Give the team a chance to approve the final schedule; they should review the calendar allocation of their estimates to see if they are still feasible.

• Conduct meetings and conversations to gain stakeholder buy-in and formal management approval.

The Develop Schedule process is iterative and can occur many times over the life of the project (at least once per project life cycle phase on a large project). The Develop Schedule process is a source of problems on the exam for many project managers. The exam will test you as an expert in handling schedule development during project planning and whenever there are changes to the project.

#### Schedule Network Analysis

Schedule network analysis is used to analyze and iterate the schedule model until the project schedule is approved. This analysis may use one or more of the following techniques:

• Critical path method

• Resource optimization

• Schedule compression

• Agile release planning

• What-if analysis (e.g. Monte Carlo analysis)

##### Critical Path Method

The critical path method involves determining the earliest and latest times each activity can start, and the earliest and latest times each can be completed. In software this can be done by entering activity start dates and durations. Where activities have dependent activities following (or succeeding) them, the software can calculate succeeding start and finish dates using duration data. Understanding this method requires you to understand the following basic concepts.

Using the Critical Path As the longest duration path through a network diagram, the critical path determines the shortest possible duration for the project. It is along this path that there is the least schedule flexibility. The easiest way to find the critical path is to identify all paths through the network diagram and add the activity durations along each path. The path with the longest duration is the critical path. Be sure you do the exercises that follow and practice doing this work for the exam.

208

EIGHT

Schedule

Near-Critical Path This path is closest in duration to the critical path and should also be watched closely. The closer in length the critical and near-critical paths are, the more risk the project has. Close monitoring and controlling activities on both the critical and near-critical paths (yes, there can be more than one) is needed to ensure the project can finish on time. Using Float For the exam, you should understand float and be able to calculate it. Note that the terms "float" and "slack" mean the same thing. Slack is an older term and is rarely used anymore. It is unlikely that you will see it on the exam but know it just in case it is used. Here are the three types of float to know for the exam.

• Total float The amount of time an activity can be delayed without delaying the project end date (or an intermediary milestone) while still adhering to imposed schedule constraints.

• Free float This is the amount of time an activity can be delayed without delaying the early start date of its successor(s) while still adhering to imposed schedule constraints.

- Project float Also known as positive total float, this is the amount of time a project can be delayed without delaying an externally imposed project completion date required by the customer or management, or the date previously committed to by the project manager.

Other things to know about float are:

• Activities on the critical path have zero float.

• Total and free float are related to activities.

• Project float is specific to the entire project.

• Negative float results when externally imposed completion dates are not feasible. These issues must be addressed in planning to ensure the approved schedule is achievable.

- If critical path activities are delayed, negative float analysis helps in looking for corrective actions to bring the schedule back within the schedule baseline.

When you know the critical path(s) and near-critical path(s), you can use float as a way to achieve better allocation of resources.

Example If you have a resource who has the needed skill set but is not very experienced, you can assign them to work on activities with float. Even if their activities take longer, the project is less likely to be delayed.

Knowing float also helps team members juggle their work on multiple projects. The amount of float tells them how much time flexibility they may have for each activity they are assigned to. Collaborating with the project manager, they may flex the exact start time of some activities with float.

Sometimes the exam questions are presented in such a way that you can simply see the amount of float, but other times you will need to calculate it. Float is calculated using either of the following equations:

• Float = Late finish (LF) - Early finish (EF)

• Float = Late start (LS) - Early start (ES)

Either formula gets you the same answer. Here is a trick for remembering the formulas:

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//726e4ffe-bde1-431e-b5c7-6085afc46402/markdown_2/imgs/img_in_image_box_45_792_109_845.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A40Z%2F-1%2F%2F8d8e829954c9967a517b9364d917f95f9dc0496afee70293dad47cfedf5cada6" alt="Image" width="7%" /></div>


“There is a start formula and a finish formula, and we always begin late.” Notice that the formula uses either two start or two finish data elements and each begins with late.

Start Formula Finish Formula

Float = LS - ES    Float = LF - EF

You determine whether to use the start or finish formula based on the information available.

Example An exam question says: “You have a late start of 30, an early start of 18, and a late finish of 34.” How do you find the float? You know to subtract the two starts or the two finishes (using the previous trick). You have not been given two finishes, so you use the equation 30-18, which equals 12.

209

Schedule

EIGHT

#### Practice with the Critical Path Method

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//726e4ffe-bde1-431e-b5c7-6085afc46402/markdown_3/imgs/img_in_image_box_67_127_119_185.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A41Z%2F-1%2F%2F91981f0faa73700c520c6302b0639e0688be2d9dab11221dbba6790e2353b54d" alt="Image" width="6%" /></div>


Think About It. Now that we have discussed the basic concepts, let's look at how the critical path method works. We'll use the network diagram in figure 8.11 as an example. The letters in the boxes indicate the activities, and the numbers above the boxes indicate the duration of each activity. The critical path is identified by the bold arrows.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//726e4ffe-bde1-431e-b5c7-6085afc46402/markdown_3/imgs/img_in_image_box_218_229_627_344.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A41Z%2F-1%2F%2F7b55386b62d4032d3be2be0e6692d446fb96e4ab8cdd7d2501a7e977b608eb0f" alt="Image" width="49%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.11 Critical path method</div> </div>


- To determine the earliest and latest each activity can start, and the earliest and latest each activity can end, perform a forward and backward pass through the network diagram.

• Forward pass The “early” figures are found by calculating from <Start> to <End> of the project, following the dependencies in the network diagram.

• Backward pass The “late” figures are found by calculating from <End> to <Start> of the project, following the dependencies in the network diagram.

Let's start with the forward pass. You need to calculate through the activities from <Start> to <End>, determining early starts and early finishes for all activities. This example uses zero as the early start for the first activity. Use figure 8.12 to walk through this.

Note: Some people, use 1 as the early start of the first activity; others use zero. Either method will get you the right answer. Pick one method and use it consistently. We use zero as the first activity's early start because people consistently find it easier when learning this concept.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//726e4ffe-bde1-431e-b5c7-6085afc46402/markdown_3/imgs/img_in_image_box_191_653_613_804.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A41Z%2F-1%2F%2F25109fb95ef9f2d6bd4e8c7e79b7348af2a09d34f13edb83f112b9c00d53a16e" alt="Image" width="51%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.12 Forward pass through network diagram</div> </div>


- It is important to look at path convergence (where paths meet). To calculate the early start and the early finish in a forward pass, you must account for all the paths that lead into that activity (notice activities F and G in figure 8.12).

• The same concept applies to the backward pass. To calculate the late finish and late start you need to consider all paths that flow backward into an activity (activities D and F in figure 8.12).

To make it easier to follow, we will step you through a forward pass here (EF and ES in parenthesis are early finish and early start, respectively):

1. In figure 8.12, paths converge at activities F and G.

2. Therefore, you must do the forward pass on both paths leading up to activity F. So:

/ Calculate the early finishes for activities D (EF = 4) and A (EF = 3).

210

EIGHT

Schedule

• Select the latest early finish between activities D and A. Use it as the early start for activity F (since F cannot start until both D and A are complete).

✓ Therefore, the early start of activity F is 4.

3. Use the same process for calculating the early finish of activities E (EF = 13) and F (EF = 12), before determining the early start of activity G (ES = 13).

Once you have completed the forward pass, you can begin the backward pass, computing the late finish and late start for each activity. The backward pass uses the duration of the critical path (in this case, 26) as the late finish of the last activity (or activities) in the network diagram.

See figure 8.13 for the late start and late finish data.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//726e4ffe-bde1-431e-b5c7-6085afc46402/markdown_4/imgs/img_in_image_box_185_275_598_427.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A42Z%2F-1%2F%2Ffc94b17398d6243cffd53d6911c082be6c2edca617056a3851ae9b0e54893ca8" alt="Image" width="50%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.13 Backward pass through network diagram</div> </div>


1. Be careful at points where paths converge as you move through the network diagram.

2. Paths converge at activity F and at activity G.

3. Work from <End> backwards. First compute the late start of activities B (LS = 22) and G (LS = 13).

4. Select the earlier late start for the late finish of activity F (since activity F must be finished before either activity B or G can start).

5. The late finish of activity F is 13.

6. This same process should be used on activities E (LS = 4) and F (LS = 5) before calculating the late finish for activity D (LF = 4).

Once you finish calculating the starts and finishes, you have the data required to calculate float. It's time to use those formulas.

What was that trick again? “There is a start formula and a finish formula, and we always begin late.” The formulas are:

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//726e4ffe-bde1-431e-b5c7-6085afc46402/markdown_4/imgs/img_in_image_box_57_672_119_724.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A42Z%2F-1%2F%2F4efff5046c49000b71b6371a3cf03a09d8f73eba5e875b7aa7367d0e1461dcc4" alt="Image" width="7%" /></div>




<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Start Formula (For Forward Pass)</td><td style='text-align: center; word-wrap: break-word;'>Finish Formula (For Backward Pass)</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Float = LS - ES</td><td style='text-align: center; word-wrap: break-word;'>Float = LF - EF</td></tr></table>

The activities with zero float are on the critical path (see the bold arrows). See figure 8.14 for the float of each activity.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//726e4ffe-bde1-431e-b5c7-6085afc46402/markdown_4/imgs/img_in_image_box_182_841_615_1000.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A42Z%2F-1%2F%2Fde9b4dfdf94c1caf3b971f59fd8f7bc07994ce4cf18a0ff810a3957c73bbde67" alt="Image" width="52%" /></div>


FIGURE 8.14 Float of activities on network diagram

211

Schedule

EIGHT

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_0/imgs/img_in_image_box_72_90_125_151.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A09Z%2F-1%2F%2Fcc4dc2d88620805a400bdf5859b67f09e135c471b3536874c9536c78d14fcdc6" alt="Image" width="6%" /></div>


Think About It. Practice will help you understand these concepts better. As you do the following exercise, think about how knowing float helps you manage your projects. On the exam there are not many questions requiring you to do these calculations, and you may not be asked to draw a network diagram. But understanding this entire process will help you get more questions right.

### 8.4 Exercise

Test yourself. In your Exercise Notebook, draw a network diagram based on the following information, and then answer questions 1-7 below.

You are the project manager for a new project and have figured out the following dependencies:

• Activity 1 can start immediately and has an estimated duration of 3 weeks.

• Activity 2 can start after activity 1 is completed and has an estimated duration of 3 weeks.

• Activity 3 can start after activity 1 is completed and has an estimated duration of 6 weeks.

• Activity 4 can start after activity 2 is completed and has an estimated duration of 8 weeks.

• Activity 5 can start after activity 4 is completed and after activity 3 is completed. This activity takes 4 weeks.

Questions:

1. What is the duration of the critical path?

2. What is the float of activity 3?

3. What is the float of activity?

4. What is the float of the path with the most float?

5. The resource working on activity 3 is replaced with another resource who is less experienced. The activity will now take 10 weeks. How will this affect the project schedule?

6. A new activity 6 is added to the project. It will take 11 weeks to complete and must be completed before activity 5 and after activity 3. Management is concerned that adding the activity will add 11 weeks to the project. Another stakeholder argues the time will be less than 11 weeks. Who is correct? Use the original information (without the change to activity 3 listed in the previous question) to answer this question.

7. Based on the information in the previous question, how much longer will the project take?

#### Answer

There are many ways to answer these questions. If you learned another way in other project management training and are comfortable with that method, use it. Here is a simple way to compute the answers.

1. The length of the critical path is 18. There are two paths here:



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Paths</td><td style='text-align: center; word-wrap: break-word;'>Duration</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Start, 1, 2, 4, 5, End</td><td style='text-align: center; word-wrap: break-word;'>18</td></tr></table>

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_0/imgs/img_in_image_box_220_884_606_981.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A09Z%2F-1%2F%2F8dcefcbf31f83c8e8a5b331e6e5b9aa1d21843f840044d596716237e79cdc09d" alt="Image" width="46%" /></div>


<div style="text-align: center;"><div style="text-align: center;">Start, 1, 2, 4, 5, End is the longest duration path and is therefore the critical path at 18 weeks.</div> </div>


212

EIGHT

Schedule

2. The float of activity 3 is 5 weeks, per the following diagram, which shows how to calculate float using the forward and backward pass.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_1/imgs/img_in_image_box_171_138_615_309.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A10Z%2F-1%2F%2Febb0fb8b882bde436c06071b4dbe2b8c910d707e9aeecb34f4913af24f7a6753" alt="Image" width="54%" /></div>


You can use either float formula to compute float:

• Late finish - Early finish = 14 - 9 = 5, or

• Late start - Early start = 8 - 3 = 5.

3. The float of activity 2 is zero; it is on the critical path. An activity on the critical path generally has no float.

4. The float of the path with the longest float is 5 weeks. There are only two paths in this example.

a. Start, 1, 2, 4, 5, End and Start, 1, 3, 5, End.

b. Only the non-critical path (Start, 1, 3, 5, End) will have float.

c. You can calculate the float for this path by adding the float for each activity:  $ 0 + 5 + 0 = 5 $.

d. Therefore, the total float of the path with the longest float is 5.

5. The resource change on activity 3 will have no effect.

a. The length of path activities 1, 3, and 5 is 13.

b. Adding 4 more weeks to the length of activity 3 will make that path 17.

c. Since that path is still shorter than the critical path, the critical path does not change.

d. The length of the critical path is still 18 weeks because activity 3 is not on the critical path.

6. The stakeholder who says the time added to the project will be less than 11 weeks is correct.

a. The new activity will be added to a non-critical path that has a float of 5 weeks.

b. Therefore, adding 11 weeks will make this path the new critical path.

c. The effect of adding an activity that takes 11 weeks is a delay to the project of 6 weeks.

7. The project will take 6 weeks longer. (Note: If you answered 24, you did not read the question correctly!) Follow the bold arrows in the following diagram.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_1/imgs/img_in_image_box_179_773_613_888.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A10Z%2F-1%2F%2F7b502b59f8955f88df85c65ab262a974e882110ab022cac58ff24d8d71319370" alt="Image" width="52%" /></div>


Note: If you want more practice, there is an extra float and critical path exercise on the RMC Resources page (rmcls.com/rmc-resources).

215

Schedule

EIGHT

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_2/imgs/img_in_image_box_85_101_138_153.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A11Z%2F-1%2F%2Fdd9a46de685b858622dc9d97f6f7033a7615672457d2a42278af1a681e4c9388" alt="Image" width="6%" /></div>


The following are good questions to practice concepts related to the critical path, float, and network diagrams:

• Can there be more than one critical path? Yes, you can have two, three, or many critical paths.

• Do you want there to be? No; having more than one critical path increases risk.

• Can a critical path change? Yes.

• Can there be negative float? Yes; it means you are behind schedule.

- How much float does the critical path have? In planning, the critical path generally has zero total float. During project executing, if an activity on the critical path is completed earlier or later than planned, the critical path may then have positive or negative float. Negative float on the critical path requires corrective action or changes to the project to bring it back in line with the schedule baseline.

- Does the network diagram change when the end date changes? Not automatically, but the project manager should investigate schedule compression options such as fast tracking and crashing, to meet the new date. Then, with approved changes, the project manager should change the network diagram. See Schedule compression in the next section of this chapter.

- Would you leave the project with negative float? No; you would compress the schedule. If schedule compression efforts do not result in zero or positive float, you need to request a change to adjust the baseline.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_2/imgs/img_in_image_box_83_413_137_465.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A11Z%2F-1%2F%2Fb6e055512adea593159139cc183c7b8fa023e6e140034ad20807972d9f58e40a" alt="Image" width="6%" /></div>


If you manually create a network diagram while taking the exam, label it with the question number, in case you want to go back to it later. You may be able to reuse the same network diagram to answer additional questions later in the exam.

It is easy to miss paths in a network diagram. When attempting to identify a critical path, carefully look at each path to ensure you calculate them all before determining which is critical.

#### Methods for Schedule Compression

One of the most common problems on projects is a difficult or unrealistic timeframe. This problem can arise during planning when management or the customer requires a completion date that cannot be met, or during executing when the project needs to be brought back in line with the schedule baseline due to delays or changes. It is the project manager's responsibility to present options and to make sure the project is achievable. Schedule network analysis techniques such as schedule compression can help.

Schedule compression describes using methods such as fast tracking and crashing to decrease project length. Schedule compression can be used during planning. Beyond the initial planning period, schedule compression may be used during Perform Integrated Change Control and Control Schedule to evaluate options and manage the impacts of change. In this case the objective would be to control the schedule without changing the schedule baseline.

##### Fast Tracking

This technique involves taking critical path activities that were originally planned to be completed sequentially and doing them in parallel for some or all of their duration, as shown in figure 8.15. The down sides: Fast tracking often results in rework, usually increases risk, and requires more attention to communication.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_2/imgs/img_in_image_box_271_809_550_871.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A11Z%2F-1%2F%2Fc3ce2a1f3812e480009eab30047bf50b1366d174cb0daecef9e5832f759d3b24" alt="Image" width="33%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.15 Fast tracking</div> </div>


<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_2/imgs/img_in_image_box_65_910_118_970.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A11Z%2F-1%2F%2F67ab04ce4fb6e300e87351aea65b3bcfa96feb4ba0f9c0172efd16d16dd09891" alt="Image" width="6%" /></div>


Think About It. Which activity in figure 8.16 would you fast track to shorten the project?

214

EIGHT Schedule

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_3/imgs/img_in_image_box_161_105_620_219.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A12Z%2F-1%2F%2Fdd7802e8cedbd87ae2abee7b05d6ae313ec7aae3c089251f2cbc356eb35173b0" alt="Image" width="55%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.16 Which activity would you fast track?</div> </div>


Assuming the dependencies are discretionary:

• Activity H could be fast tracked by making it occur at the same time as (in parallel with) Activity G.

• Activities C and H could be fast tracked by doing part of Activity C in parallel with Activity H.

• Any other pair of activities on the critical path could possibly be fast tracked.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_3/imgs/img_in_image_box_47_368_97_427.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A12Z%2F-1%2F%2F081b7685c2d18251a3022afdb5e8415c8de30cc72e5e55ff7061b3422c683254" alt="Image" width="6%" /></div>


Think About It. Let's look at an example scenario to help you further think about fast tracking and creating options. This example may or may not have made use of a network diagram.

Example A cable TV provider was using a hybrid approach to implement web analytics tools. The team was asked to fast track the product launch to coincide with a large marketing push in response to competition from streaming channels.

• The product owner met with management to review the release map and product backlog.

• They identified scope that could be deferred until after initial launch, allowing most functionality to be delivered on time and accommodate the new promotion.

• The customer could at first create some reports in spreadsheets rather than relying on the tool, and some metrics could be eliminated from scope or deferred.

• The core data and decision-making frameworks would be delivered on time.

• Management approved the reduced functionality and workarounds.

• The team proceeded and delivered most of the business value in time for the campaign.

- The team prepared instructions and training for early buyers to mitigate the effects of a reduced reporting functionality.

• A future release of the project completed the functionality and retired the spreadsheets.

Here, scope was compromised temporarily to fast track the schedule. This added some risk and reduced initial functionality. Yet it was an effective way to meet a decreased schedule requirement.

##### Crashing

The schedule compression method called “crashing” involves adding or adjusting resources while maintaining the original project scope. Crashing by definition results in increased costs. It trades time for money. It may also increase risk.

Example In the network diagram in figure 8.16, a contracted resource could supplement the internal resources' efforts on a critical path activity. Another option to crash the project might be to buy a software application. This assumes either option adds cost but helps the team save time.

In the cable TV provider scenario, it may also be possible to crash by adding resources and get all the functionality completed in time for the campaign. For the exam, remember that you need to identify all possible options and, if given a choice between crashing or fast tracking, select the choice or combination of choices with the least negative impact on the project, and adds the least risk.

Think About It. If you have negative project float (meaning the estimated completion date is after the desired date), would your first choice be to tell the customer the date cannot be met and to ask for more time? No; the first choice would be to analyze what could be done about the negative float by compressing the schedule. In crashing or fast tracking, it is best to carefully consider all potential choices and then select the option or options that have the least negative impact on the project and/or adds the least additional risk.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_3/imgs/img_in_image_box_46_924_98_984.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A12Z%2F-1%2F%2F2611294225d8ceb79c4d931215bcd8e413678283852bb19b2ad891dcfbbd3015" alt="Image" width="6%" /></div>


215

Schedule

EIGHT

Many project managers have gaps in their knowledge in this area. Let's review another scenario. Figure 8.16 shows that a project duration is estimated to be 33 months. But what if you're given a constraint of 30 months? Options are listed in the following table to illustrate how the project duration may be shortened by three months.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>How to Achieve It (or what it is called)</td><td style='text-align: center; word-wrap: break-word;'>Explanation (including assumptions made)</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Option</td><td style='text-align: center; word-wrap: break-word;'>Reduce risks.</td><td style='text-align: center; word-wrap: break-word;'>Look at the estimates and see which contain hidden risks. By reducing risks, estimates can often be lowered. This way, the project finishes faster.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Execute Activities H and C in parallel.</td><td style='text-align: center; word-wrap: break-word;'>Fast track (compress schedule).</td><td style='text-align: center; word-wrap: break-word;'>Will work if the dependency between activities H and C is discretionary. Or may add risk.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Add resources to Activity G from the within organization (adds cost).</td><td style='text-align: center; word-wrap: break-word;'>Crash (compress schedule).</td><td style='text-align: center; word-wrap: break-word;'>Would work if adding resources to activity G is practical and there are resources available.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Cut Activity H.</td><td style='text-align: center; word-wrap: break-word;'>Reduce scope.</td><td style='text-align: center; word-wrap: break-word;'>Not the first choice as it may affect the customer; still, reducing scope should be considered an option.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Hire consultants to assist on Activity G, H, or C (adds cost).</td><td style='text-align: center; word-wrap: break-word;'>Crash (compress schedule).</td><td style='text-align: center; word-wrap: break-word;'>Would work if adding external resources to these activities is practical and resources are available.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Move more experienced people to critical path activities (activities G, H, or C).</td><td style='text-align: center; word-wrap: break-word;'>Compress schedule.</td><td style='text-align: center; word-wrap: break-word;'>Would work if some of the critical path activities are being done by less experienced people, and more experienced people are available.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Cut time by cutting quality. (Do not get excited! Read on.)</td><td style='text-align: center; word-wrap: break-word;'>Lower quality standards.</td><td style='text-align: center; word-wrap: break-word;'>Quality is a project constraint; lowering quality standards is an option. If it is feasible, it would probably be faster to complete the project with lowered quality standards. Might add risk.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Get more work done with the same number of resources.</td><td style='text-align: center; word-wrap: break-word;'>Work overtime.</td><td style='text-align: center; word-wrap: break-word;'>Not an option during project planning. There are many other ways to compress a schedule that do not have the negative effects of overtime. Save it for a last resort.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Say no; the project must have 33 months.</td><td style='text-align: center; word-wrap: break-word;'>Say it can&#x27;t be done.</td><td style='text-align: center; word-wrap: break-word;'>A viable option only after other alternatives are exhausted. Always endeavor to provide options.</td></tr></table>

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fff9d0c0-cd37-4ae8-bb5b-449a936d9ac6/markdown_4/imgs/img_in_image_box_67_734_119_792.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A12Z%2F-1%2F%2F43fe0fcc0fc2116303580b67d3a697bcf1801d2198fa7d142d9c8b1821242704" alt="Image" width="6%" /></div>


Think About It. Now consider the following questions in thinking about which of the options listed are best. There is no way to know since the scenario is limited. The goal here is, as always, to consider the impacts of each one:

• Is the best option to cut time by lowering quality standards?

• What are the impacts of cutting quality?

• Is there another option?

• Why not do what many project managers do—ask for more resources? But adding resources also adds cost.

• Why not work overtime? Overtime is not free. Most organizations are working at close to 100 percent capacity. The project team working overtime runs the risk of burnout. Also, the possibilities for responding to emergencies for other projects are narrowed, putting other projects at risk. For the exam, don't consider overtime a viable option until all other options are exhausted.

- Generally, it's best to look at risks and then reestimate. Once you know that the schedule (or budget) must be reduced, investigate activity estimates that contain the most unknowns. Reduce or eliminate these risks, thus decreasing the schedule. Eliminate more risks; everyone wins! If this offers only a partial solution, you could continue looking to shorten the schedule with other methods.

216

EIGHT

Schedule

##### Schedule Compression Summary

Look at the schedule compression options again, and review the impacts of each option. Note that these methods can apply to a project using any life cycle and development approach.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Option</td><td style='text-align: center; word-wrap: break-word;'>General Impacts on the Project</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Fast track</td><td style='text-align: center; word-wrap: break-word;'>• Always adds risk• May add management time for the project manager</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Crash</td><td style='text-align: center; word-wrap: break-word;'>• Always adds cost• May add management time for the project manager• May add risk</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Reduce scope</td><td style='text-align: center; word-wrap: break-word;'>• May save cost, resources, and time• May negatively impact customer satisfaction</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Cut quality</td><td style='text-align: center; word-wrap: break-word;'>• May save cost, resources, and time• May increase risk• Requires good metrics on current and desired quality levels to be effective• May negatively impact customer satisfaction</td></tr></table>

There is an additional schedule compression exercise on the RMC Resources page (rmcls.com/rmc-resources).

### 8.5 Exercise

Consider the following question and write the answer. You may choose to do so in your Exercise Notebook.

Management has said to get the project completed two weeks early. What is the best thing to do?

A. Consult the project sponsor

B. Crash

C. Fast track

D. Advise management of the impact of the change

#### Answer

Did you get fooled by this question? Did you think you had to choose between crashing and fast tracking? There is no information provided to help you determine which one is better. Therefore, the best choice presented is D, advise management of the impact of the change. This is the best choice because you will have to assess the impact of the change and inform management of that no matter what else you do. There is no data to back up the other possible answers.

The exam will include many such questions requiring you to know that a project manager needs to analyze first, create options to deal with the change, and then let management, the sponsor, the customer, or other parties know the impacts of their request (see the four-step process for handling changes in the "Integration" chapter). A project manager does not just say yes! Instead, after analyzing the change for its impact on all areas of the project (cost, risk, resources, etc.), they could say something like, "Yes, I would be happy to make the change, but the project will be delayed two weeks. And I will need two more resources, or the project will cost $25,000 more."

For questions about changes to the network diagram, make sure you look for shifts to new critical paths caused by the changes to the network diagram or to activity durations.

217

Schedule

EIGHT

#### Data Analysis and Simulation

In creating a finalized, realistic schedule, it is helpful to ask, “What if a particular factor changed on the project? Would that produce a shorter schedule?” The assumptions for each activity can change and, therefore, the activity durations can also change. One of the ways to calculate the effect of these changes is through what-if scenario analysis. One example is Monte Carlo analysis.

##### Monte Carlo Analysis

This technique uses computer software to simulate the outcome of a project, based on the three-point estimates (optimistic, pessimistic, and most likely) for each activity and the network diagram. It is more accurate than other methods because it simulates the actual details of the project and calculates probability.

The simulation can tell you:

• The probability of completing the project on any specific day

• The probability of completing the project for any specific cost

• The probability of any activity actually being on the critical path

• An indication of the overall project risk

Monte Carlo analysis can help deal with “path convergence,” places in the network diagram where multiple paths converge into one or more activities, thus adding risk to the project (see figure 8.17). Monte Carlo analysis is also used as a risk management tool to quantitatively analyze risks (see the “Risk” chapter).

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//ce73c23d-1765-470e-8f2a-4129039327ed/markdown_1/imgs/img_in_image_box_269_446_476_666.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A38Z%2F-1%2F%2F984780d2dc6d3b551377db9c88dfecece406fbd208997f69cfba1fe334082fda" alt="Image" width="25%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.17 Path convergence</div> </div>


#### Resource Optimization

Resource optimization refers to finding ways to adjust the use of resources. There are two techniques that can achieve this outcome.

##### Resource Leveling

Resource leveling is used to produce a resource-limited schedule. Leveling lengthens the schedule and increases cost to deal with a limited number of resources, resource availability, and other resource constraints. A little-used function in project management software, this technique allows you to level the peaks and valleys of the schedule from one month to another, resulting in a more stable number of resources used on your project.

You might level the resources if your project used 5 resources one month, 15 the next, and 3 the next, or some other up-and-down pattern that was not acceptable. Leveling could also be used if you did not have 15 resources available and preferred to lengthen the project (which is a result of leveling) instead of hiring more resources.

##### Resource Smoothing

Resource smoothing is a modified form of resource leveling, where resources are leveled only within the limits of the float of their activities, so the completion dates of activities are not delayed.

218

EIGHT

Schedule

#### Agile Schedule Development

Agile teams attempt to keep schedule and cost stable while negotiating scope to make that happen. The concept of float certainly applies to agile although agile practitioners do not always use the project schedule network diagram. Instead, based upon the estimated story sizes and prioritization, an agile team will gather stories for each iteration and estimate how much can be completed in a given iteration, adjusting estimates until an average velocity is established.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//ce73c23d-1765-470e-8f2a-4129039327ed/markdown_2/imgs/img_in_image_box_671_123_721_181.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A38Z%2F-1%2F%2F235eb10dd30099ced0c4d724d5d6775bd4919c32fccf32af3f9a863add8c1937" alt="Image" width="6%" /></div>


##### Agile Release Planning

Agile projects are often divided into releases and iterations. An iteration is a short, timeboxed development period, typically one to four weeks in duration. A release is a group of iterations that results in the completion of a valuable deliverable on the project. An agile project will have one or more releases, each of which will contain one or more iterations, as illustrated in figure 8.18.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//ce73c23d-1765-470e-8f2a-4129039327ed/markdown_2/imgs/img_in_image_box_49_322_740_497.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A39Z%2F-1%2F%2F49be450093a6d71b271289a8beeb2a3e53db56f4d21bddc30b5db5689cd59215" alt="Image" width="84%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.18 Project broken into releases and iterations</div> </div>


This diagram shows a single project with four planned releases. Agile teams start planning releases and iterations early in the project life cycle and progressively refine the planning effort multiple times as the project progresses.

Do you remember our discussion on the backlog and product roadmap in the “Scope” chapter? While the backlog and the product roadmap help identify and manage project scope, they are also valuable tools that help develop and manage the project schedule.

On agile projects, teams select from the top-priority backlog items to come up with their next iteration goal. Then,

they decompose the iteration goal into user stories to get the iteration plan. Planning continues by decomposing those user stories into tasks. While the work is being done,

the team discusses the details of the work in the daily

standup meetings.

##### Cumulative Flow Diagrams

Cumulative flow diagrams (CFDs) are valuable tools for tracking and forecasting the delivery of value. They can help the project manager gain insight into project issues, cycle times, and likely completion dates. Basically, CFDs are stacked area graphs that depict the features that are in progress, remaining, and completed over time. An example of a CFD is illustrated in figure 8.19.

This figure shows the features completed versus the features remaining for a fictional project that is still in progress. The orange area represents all the planned features to be built. This number rose from 400 to 450 in June and then to 500 in August as additional features were added to

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//ce73c23d-1765-470e-8f2a-4129039327ed/markdown_2/imgs/img_in_chart_box_399_666_753_963.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A39Z%2F-1%2F%2F3b503575aeaae3da68b8e65f96bf74815fc8ef511dc5bf18ae4d7f83bbd7372a" alt="Image" width="43%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.19 Cumulative flow example</div> </div>


219

Schedule

EIGHT

the project. The dotted section plots the work in progress, and the striped section shows the total number of features completed on the project.

##### Velocity

As mentioned in an earlier section of this chapter, teams establish an average velocity, which describes how much work (what stories) can be completed in a given iteration. The team iteratively analyzes their actual velocity against the stories in the backlog to be completed, so this practice works as a planning method and as a control method. Velocity works like this:

- Before the first iteration of the project the team establishes a starting velocity. The metric is most often story points. This helps estimate what stories can be completed in the first iteration.

- For the first iteration, the team selects and builds stories from the top of the prioritized backlog based on the starting velocity.

• After the first iteration (not including iteration zero), the estimate is compared to what the team actually completed, and for the second iteration the team will use the actual velocity from the first iteration. They select stories from the top of the prioritized backlog based on this number.

• After several iterations the team has an average or working velocity. They will continue to select stories from the top of the backlog based on average velocity. They recalculate the average velocity as it stabilizes.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//ce73c23d-1765-470e-8f2a-4129039327ed/markdown_3/imgs/img_in_chart_box_183_416_615_660.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A39Z%2F-1%2F%2Fe45db03341fc768ea2781e63261228bbdec5d9a76bdb09493c013fd27161eeea" alt="Image" width="52%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.20 Velocity tracking chart</div> </div>


Cautions on Story Point Estimates and Velocity

The use of story points is a relative estimating method that is very effective. But problems with this method can only be avoided if teams use it properly and good leadership skills and communications ensure that other stakeholders understand it. Story points in estimating and velocity in practice are strictly tailored to every team and every project. For analyzing performance, the progress of no two teams can be compared based on story points or velocity, and no single team can compare their story points or velocities from one project to the next.

Think About It. Consider this scenario. A hybrid team is using story points to track their velocity on a rewrite of a customer account management website. The team is using short iterations and demos to deliver functionality in a largely predictive organization. After the steering committee learned the team was using story points and velocity to track their progress, they focused on the weekly velocity figures.

If the points completed did not increase each week, the team was asked to explain. Consciously or unconsciously, the team started to inflate their story point estimates for work. That way, they would have more points to report as complete each week. A screen that might have been originally estimated as three points became five. However, the points were now meaningless to the team since they could not compare current to past performance. Questions like "are these five new points or five old points?" became common wastes of time.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//ce73c23d-1765-470e-8f2a-4129039327ed/markdown_3/imgs/img_in_image_box_71_837_121_898.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A39Z%2F-1%2F%2F7258d1731542db5ebad8bd5c15bb2fcf705d5273e43d399678d8342f86fa7866" alt="Image" width="6%" /></div>


220

EIGHT

Schedule

To reset the process, the team used affinity estimation to compare and reset new stories with the point value from previous stories of comparable size and complexity. Story point inflation was reversed, and points became useful for the team once more. The project manager explained the situation to the steering committee, who agreed not to focus on weekly velocity but to use velocity only to track actual versus planned project progress across iterations toward a scheduled release. The project manager no longer showed detailed velocity metrics to management but instead used graphics like the following burndown chart. Figure 8.21 shows project progress over 4 iterations. It turns data into information, using velocity but better representing project progress than would focusing on the actual velocity data.

<div style="text-align: center;"><div style="text-align: center;">Planned vs Actual Work toward Release 1</div> </div>


<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//ce73c23d-1765-470e-8f2a-4129039327ed/markdown_4/imgs/img_in_chart_box_202_269_577_468.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A40Z%2F-1%2F%2F1c58e4ce2a5b63c4238de96dff34331109d1451ab9ad47ff88763239852382f3" alt="Image" width="45%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 8.21 Progress tracking burndown chart</div> </div>


#### Outputs of Developing the Plan-driven Schedule

The Develop Schedule process results in the project schedule, the schedule baseline, schedule data, change requests, and updates to any related project documents. The following sections describe these outputs.

##### Project Schedule

The project schedule is the result of the previous planning processes and the schedule network analysis that is performed as part of the Develop Schedule process. As planning progresses, the schedule will be iterated in response to risk management and other parts of project planning until an acceptable and realistic schedule can be agreed upon. The iterated and realistic schedule that results from this effort is called the schedule baseline, which becomes part of the project management plan.

The project schedule includes project activities with assigned dates for each activity, and includes milestones inserted by the project manager or management. The project schedule may be represented in formats such as bar charts or network diagrams.

The project schedule can be shown with or without dependencies (logical relationships) and can be shown in any of the following presentations created from the schedule model, depending on the needs of the project:

• Network diagram (described earlier in this chapter)

• Milestone chart

• Bar chart

221

Schedule

EIGHT

##### Milestone Charts

These are similar to bar charts (described next), but they only show major events. Remember that milestones have no duration; they simply represent the completion of activities. Milestones, which may include “requirements are complete” or “design is finished,” are part of the inputs to the Sequence Activities process. Milestone charts are good tools for reporting to management and to the customer. See the example in figure 8.22.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>ID</td><td style='text-align: center; word-wrap: break-word;'>Milestone</td><td style='text-align: center; word-wrap: break-word;'>December</td><td style='text-align: center; word-wrap: break-word;'>January</td><td style='text-align: center; word-wrap: break-word;'>February</td><td style='text-align: center; word-wrap: break-word;'>March</td><td style='text-align: center; word-wrap: break-word;'>April</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>1</td><td style='text-align: center; word-wrap: break-word;'>Start</td><td style='text-align: center; word-wrap: break-word;'>*12/14</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>2</td><td style='text-align: center; word-wrap: break-word;'>Requirements gathered</td><td style='text-align: center; word-wrap: break-word;'>4 ▶ 12/31</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>3</td><td style='text-align: center; word-wrap: break-word;'>Design complete</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>*1/17</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>4</td><td style='text-align: center; word-wrap: break-word;'>Coding complete</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>*2/15</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>5</td><td style='text-align: center; word-wrap: break-word;'>Testing complete</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>*3/15</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>6</td><td style='text-align: center; word-wrap: break-word;'>Implementation complete</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>*4/4</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>7</td><td style='text-align: center; word-wrap: break-word;'>End</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>*4/15</td></tr></table>

# FIGURE 8.22 Milestone chart

#### Bar Charts

Bar charts are weak planning tools, but they are effective for progress reporting and control. They are not project management plans. The velocity tracking chart in figure 8.20 is a bar chart.

##### Schedule Baseline

The schedule baseline is the approved version of the schedule model used to manage the project; what the project and team performance is measured against. On plan-based projects the baseline can only be changed as a result of formally approved changes. If the project can be done faster than the customer requested, there may be a difference between the schedule baseline and the end date required by the customer. This difference is project float. Agile projects tend to have a "moving baseline" for velocity but it is assumed that this will soon stabilize after a few iterations. Agile project schedules are normally baselined since exact scope is negotiable.

Schedule Data Schedule data encompasses all the data used to create the schedule model, including milestones, project activities, activity attributes, duration estimates, dependencies, and the assumptions and constraints used in creating the schedule.

Change Requests This is another planning process with change requests as an output. As the project progresses, any changes to the schedule may necessitate changes to other parts of the project management plan. Change requests are addressed through the integrated change control process.

Project Documents Updates The process of creating a final and realistic schedule could result in updates to project documents including duration estimates, resource requirements, activity attributes, risk register, assumption log, and the lessons learned register.

#### Understanding the Benefits of Different Presentation Formats

No matter how much you know about project management, there are always questions on the exam that will be tricky if you have never thought about them before. The different types of schedule presentations can be one of those areas. Think through the next exercise. Make sure you look for anything you did not know, and organize your knowledge according to the exercise answers. You can get quite a few questions right on the exam if you know what each of the schedule presentations is used for.

222

EIGHT

Schedule

### 8.6 Exercise

Test yourself! In your Exercise Notebook, record the answers to the following questions.

1. Under what circumstances would you use a network diagram?

2. Under what circumstances would you use a milestone chart?

3. Under what circumstances would you use a bar chart?

#### Answer

1. To show interdependencies between activities; to calculate the critical path; to show the length of the project

2. To report to senior management

3. To track progress; to report to the team

### Control Schedule

A major measure of project (and project manager) success is the schedule baseline—the end date agreed to in planning and adjusted for approved changes—being met. Monitoring and controlling efforts and taking preventive and corrective action throughout the project keeps it in line with the plan. This is as important to the project's success as planning it well.

Schedule control includes looking for the things that are causing preventable changes and influencing the sources, or root causes, of the changes.

Example There is one person or one piece of work causing a lot of changes.

This is a signal that the project manager and team need to evaluate it and do something about it rather than letting the issues and the high number of changes continue. Using diligence and being proactive is the key to success.

#### Process Groups Model

PG: Monitoring and Controlling

Process: Control Schedule

##### ECO

Domain II

Task 6 Plan and manage schedule

PMBOK $ ^{8} $ Guide

Domain 2.7 Measurement

If the project can no longer meet the agreed-upon completion date, and achieving the completion date is a critical factor for success of the project, the project manager might recommend the termination of the project before any more company time is wasted.

Think of schedule control as protecting the hard work of all those involved in planning to make sure what was planned occurs as close to the plan as possible. Think of being constantly on the lookout for anything that might be affecting the schedule. The following are some activities that can be used to help control the schedule:

• Access the PMIS to review current work performance data and compare actual progress to what was planned.

• Reestimate the remaining components of the project partway through the project (see the following discussion).

- Conduct performance reviews by formally analyzing how the project is doing (see the Earned Value Management discussion in the “Budget and Resources” chapter).

- Perform data analysis (this can include earned value analysis, trend analysis, variance analysis, and what-if scenario analysis) of project performance.

- Confirm that critical path activities are being completed within the schedule baseline. If they are not, adjust the critical path by taking advantage of available float.

- Adjust future parts of the project to deal with delays, rather than asking for a schedule extension (using schedule compression techniques such as leads and lags, crashing, and fast tracking).

• Consider adjusting to optimize resources assigned to activities to improve the performance.

• Continue efforts to optimize the schedule.

- Adjust metrics that are not giving the project manager the information needed to properly understand performance and manage the project. Add new metrics if needed.

223

Schedule

EIGHT

- Adjust the format or required content of reports as needed to capture the information necessary to control and manage the project (see the Progress Reporting discussion in the "Budget and Resources" chapter).

• Identify the need for changes, including corrective and preventive actions.

• Follow the change control process.

Efforts to control the schedule when the project is using a change-driven approach include:

• Comparing work actually completed to what was predicted to be complete within a given work cycle using an iteration burndown chart.

• Holding retrospectives to address possible process improvements.

• Reprioritizing the backlog of work.

• Identifying and managing changes as they arise.

#### Methods for Control Schedule

Although the project manager did their best to understand the project well enough to estimate it sufficiently in planning, there are always changes that occur during a project that impacts those plans. Measuring performance on a regular basis, using schedule compression methods where necessary, and reestimating as needed are common methods of adjusting for normal changes to time management on projects.

##### Measurement

The schedule itself has a natural set of metrics with which to measure progress. Traditional EVM is a common practice on plan-driven projects and agile teams use velocity to constantly measure actual progress against planned, and adjust as needed. Agile teams also use burnup and burndown charts to measure overall project progress.

##### Reestimating

It is standard practice to reestimate the remaining work at planned times and whenever it seems prudent. This is how the project manager makes sure they can still satisfy the project objectives within the schedule, budget, and other project constraints, and adjust the performance measurement baseline if they cannot.

#### Artifacts of Control Schedule

The Control Schedule process results in work performance information, schedule forecasts, and sometimes change requests. For example, a change to the schedule might require additional resources or a change in scope. Such changes must be handled as part of the Perform Integrated Change Control process. Make sure you review this important process in the "Integration" chapter. On agile projects, again, it is most often scope—features and functions—that are renegotiated if, as usual, schedule is to be kept stable and the team is behind when measured against the plan.

This process may also result in updates to the schedule management plan and performance measurement baseline in addition to project documents such as the assumption log, risk register, and lessons learned register, and changes to any other part of the project.

#### Putting It All Together

Were you surprised at the amount of effort it takes to plan and manage a project schedule? It is the project managers' responsibility to create a realistic schedule and to monitor and control it. For the exam, make sure you understand the precedence diagramming method and know how estimating is done in both predictive and adaptive environments. Go through the Quicktest at the beginning of the chapter again to help identify any gaps in your knowledge. Review the concepts you are still unsure about.

Complete the following exercises based on our library case study.

224

EIGHT

Schedule

### 8.7 Exercise

Review the list of work the project manager needs to do to create the project schedule. Here or in your Exercise Notebook indicate the order in which this work should be completed by placing the letter assigned to each item into the order table below. Also indicate which process this work describes.

A. Each of the stakeholders or team members who are responsible for an activity will be responsible for determining how long the activity should take.

B. The project manager will bring together the architect, construction team lead, librarian, and the other team members to review the work breakdown structure and determine the activities needed to complete the project.

C. The project manager needs to think about who will be needed to complete the project and how to measure performance

D. All the activities will be plotted onto a calendar based on the availability of the person assigned to complete it.

E. The team will discuss each activity required and identify its predecessors and successors.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Order</td><td style='text-align: center; word-wrap: break-word;'>Work</td><td style='text-align: center; word-wrap: break-word;'>Process Groups Model Name</td></tr><tr><td colspan="3">1st</td></tr><tr><td colspan="3">2nd</td></tr><tr><td colspan="3">3rd</td></tr><tr><td colspan="3">4th</td></tr><tr><td colspan="3">5th</td></tr></table>

##### Answer



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Order</td><td style='text-align: center; word-wrap: break-word;'>Work</td><td style='text-align: center; word-wrap: break-word;'>Process Groups Model Name</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>1st</td><td style='text-align: center; word-wrap: break-word;'>C</td><td style='text-align: center; word-wrap: break-word;'>Plan Schedule Management</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>2nd</td><td style='text-align: center; word-wrap: break-word;'>B</td><td style='text-align: center; word-wrap: break-word;'>Define Activities</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>3rd</td><td style='text-align: center; word-wrap: break-word;'>E</td><td style='text-align: center; word-wrap: break-word;'>Sequence Activities</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>4th</td><td style='text-align: center; word-wrap: break-word;'>A</td><td style='text-align: center; word-wrap: break-word;'>Estimate Activity Duration</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>5th</td><td style='text-align: center; word-wrap: break-word;'>D</td><td style='text-align: center; word-wrap: break-word;'>Develop Schedule</td></tr></table>

225

Schedule

EIGHT

### 8.8 Exercise

Try this exercise based on a case study using adaptive tools.

The library software application needs to be upgraded. A backlog of requested features has been collected and prioritized in the following backlog. Review this list and with the information provided, draft a Product Roadmap with three releases. Each release should include an extra feature if the team has time (stretch goal). Be sure to consider the dependencies.

#### Backlog



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Feature#</td><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'>Priority</td><td style='text-align: center; word-wrap: break-word;'>Dependencies</td><td style='text-align: center; word-wrap: break-word;'>Estimate (est.)</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>1</td><td style='text-align: center; word-wrap: break-word;'>Map of library</td><td style='text-align: center; word-wrap: break-word;'>High</td><td style='text-align: center; word-wrap: break-word;'>None</td><td style='text-align: center; word-wrap: break-word;'>1 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>2</td><td style='text-align: center; word-wrap: break-word;'>Collect patron profile information</td><td style='text-align: center; word-wrap: break-word;'>Med</td><td style='text-align: center; word-wrap: break-word;'>None</td><td style='text-align: center; word-wrap: break-word;'>3 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>3</td><td style='text-align: center; word-wrap: break-word;'>Allow patron to set up login id and password</td><td style='text-align: center; word-wrap: break-word;'>High</td><td style='text-align: center; word-wrap: break-word;'>2</td><td style='text-align: center; word-wrap: break-word;'>5 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>4</td><td style='text-align: center; word-wrap: break-word;'>“Resume Builder”</td><td style='text-align: center; word-wrap: break-word;'>High</td><td style='text-align: center; word-wrap: break-word;'>3</td><td style='text-align: center; word-wrap: break-word;'>5 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>5</td><td style='text-align: center; word-wrap: break-word;'>“Job application cover letter builder”</td><td style='text-align: center; word-wrap: break-word;'>Med</td><td style='text-align: center; word-wrap: break-word;'>4</td><td style='text-align: center; word-wrap: break-word;'>3 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>6</td><td style='text-align: center; word-wrap: break-word;'>Connect to popular job boards</td><td style='text-align: center; word-wrap: break-word;'>Med</td><td style='text-align: center; word-wrap: break-word;'>None</td><td style='text-align: center; word-wrap: break-word;'>5 story points each</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>7</td><td style='text-align: center; word-wrap: break-word;'>Search by author name</td><td style='text-align: center; word-wrap: break-word;'>Med</td><td style='text-align: center; word-wrap: break-word;'>None</td><td style='text-align: center; word-wrap: break-word;'>3 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>8</td><td style='text-align: center; word-wrap: break-word;'>Search by book title</td><td style='text-align: center; word-wrap: break-word;'>High</td><td style='text-align: center; word-wrap: break-word;'>None</td><td style='text-align: center; word-wrap: break-word;'>5 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>9</td><td style='text-align: center; word-wrap: break-word;'>Search by magazine article title</td><td style='text-align: center; word-wrap: break-word;'>Med</td><td style='text-align: center; word-wrap: break-word;'>None</td><td style='text-align: center; word-wrap: break-word;'>8 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>10</td><td style='text-align: center; word-wrap: break-word;'>Ability to join a book club</td><td style='text-align: center; word-wrap: break-word;'>Med</td><td style='text-align: center; word-wrap: break-word;'>11</td><td style='text-align: center; word-wrap: break-word;'>3 story points</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>11</td><td style='text-align: center; word-wrap: break-word;'>Ability to add a new book club</td><td style='text-align: center; word-wrap: break-word;'>Med</td><td style='text-align: center; word-wrap: break-word;'>3</td><td style='text-align: center; word-wrap: break-word;'>5 story points</td></tr></table>

#### Product Roadmap



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'></td><td colspan="2">Release 1</td><td colspan="2">Release 2</td><td colspan="2">Release 3</td></tr><tr><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'>Est.</td><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'>Est.</td><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'>Est.</td></tr><tr><td rowspan="3">High priorities</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Total</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Stretch goal</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Total with Stretch</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr></table>

226

EIGHT

Schedule

#### Answer

Does your product roadmap look like this? In parentheses is the feature number for each story. If you have variations, make sure that you understand the differences and think about why your version is a plausible way to approach the project as well as why ours is a plausible version of completing the project.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td rowspan="2"></td><td colspan="2">Release 1</td><td colspan="2">Release 2</td><td colspan="2">Release 3</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'>Est.</td><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'>Est.</td><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'>Est.</td></tr><tr><td rowspan="3">High priorities</td><td style='text-align: center; word-wrap: break-word;'>Map of library (I)</td><td style='text-align: center; word-wrap: break-word;'>1</td><td style='text-align: center; word-wrap: break-word;'>Search by book title (8)</td><td style='text-align: center; word-wrap: break-word;'>5</td><td style='text-align: center; word-wrap: break-word;'>Connect to first job board (6)</td><td style='text-align: center; word-wrap: break-word;'>5</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Collect patron profile (2)</td><td style='text-align: center; word-wrap: break-word;'>3</td><td style='text-align: center; word-wrap: break-word;'>“Resume Builder” (4)</td><td style='text-align: center; word-wrap: break-word;'>5</td><td style='text-align: center; word-wrap: break-word;'>“Job application cover letter builder” (5)</td><td style='text-align: center; word-wrap: break-word;'>3</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Allow patron to set up login id and password (3)</td><td style='text-align: center; word-wrap: break-word;'>5</td><td style='text-align: center; word-wrap: break-word;'>Ability to add a book club (11)</td><td style='text-align: center; word-wrap: break-word;'>5</td><td style='text-align: center; word-wrap: break-word;'>Ability to join a book club online (10)</td><td style='text-align: center; word-wrap: break-word;'>3</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Total</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>9</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>15</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>11</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Stretch goal</td><td style='text-align: center; word-wrap: break-word;'>Search by magazine article titles (9)</td><td style='text-align: center; word-wrap: break-word;'>8</td><td style='text-align: center; word-wrap: break-word;'>Search by author name (7)</td><td style='text-align: center; word-wrap: break-word;'>3</td><td style='text-align: center; word-wrap: break-word;'>Connect to second job board (6)</td><td style='text-align: center; word-wrap: break-word;'>5</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Total with Stretch Goal</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>17</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>18</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>16</td></tr></table>

227

228

9

# Budget and Resources

## Introduction

Do you create a budget for your projects? Do you have practical experience managing and controlling project budgets? If these efforts are not part of how you manage your real-world projects, make sure you read this chapter carefully and fully understand the concepts presented.

While managing cost (i.e., the project budget) the project manager is primarily concerned with estimating, and with earned value management (EVM). A subset of budget management is material resource management since resources cost money, so must be in the project budget. Cost management includes estimating and uses the same estimating techniques covered in the Schedule chapter. In this chapter we explain in detail the EVM content, which is also applicable to both schedule and cost.

Think About It. A project manager has to be able to think simultaneously about the big picture as well as the details. To think holistically, it's hard to think about cost without also considering scope and schedule. The team uses the project budget and schedule to build the project scope. Many of the same estimating and EVM methods are used for cost management as well as schedule management. Earned value analysis is all about how much of the project's schedule and budget have been used to build the scope as compared to what was planned to be built and spent at a certain point in time.

If you recall, a plan-driven project decomposes the product and project management work into work packages, the artifact of which is the WBS ("Scope" chapter). The activities to build the work packages are then sequenced into a schedule network diagram ("Schedule" chapter) where activity duration estimates are placed. In this chapter, we'll discuss how cost is estimated based on those activities.

Agile teams have a fixed cost and time so budgeting is more straightforward. For agile projects the work is also decomposed, but remember it is kept track of in a backlog. A product backlog is somewhat analogous to a WBS in this context because it should include everything in the project. The backlog is broken down from the feature level to the story level, and then each story may be broken into tasks. Here the (agile) use of the word "task" is analogous to "activity" in plan-driven projects. In either case the work is being broken down so it can be easily understood, estimated, and assigned to resources. On exam questions, look for the appropriate context so you can identify the correct answer.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//08a761d2-2d0b-4e2b-a601-a4b139bd1137/markdown_2/imgs/img_in_image_box_50_368_102_428.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A52Z%2F-1%2F%2F12e70f9e949214ec83f92f455d0188fdb3190c577bbebe2ec1194250d5ca96c6" alt="Image" width="6%" /></div>


<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//08a761d2-2d0b-4e2b-a601-a4b139bd1137/markdown_2/imgs/img_in_image_box_569_590_614_649.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A53Z%2F-1%2F%2Fead1277fbeab5ed75131ffae6f614ef5604606216eb85e73696099b621b95899" alt="Image" width="5%" /></div>


#### Definitions Related to Budget and Resource Management

Here is the budget-related vocabulary you will want to be sure you know for reading this chapter and for the exam. Vocabulary related to specific EVM metrics will be discussed in the Earned Value Management section later in this chapter.

#### Earned Value (EV)

EV is a metric that gives the estimated value of the work that has actually been completed on the project to date. A project manager uses EV along with other metrics in earned value analysis to determine how well the project is doing compared to its performance measurement baseline (the scope, schedule, and cost baselines).

### QUICKTEST

• Cost Management process

• Earned value (EV)

• Earned value analysis (EVA)

• Earned value management (EVM)

• Cost management plan

• Types of cost

- Variable

- Fixed

- Direct

- Indirect

• Top-down estimating

• Bottom-up estimating

• Estimate ranges

- Rough order of magnitude (ROM)

- Budget

- Definitive

• Basis of estimates

• Adaptive estimating

• Cost aggregation

• Burn rate

• Progress reports

• Reserve analysis

• Earned value terms

- PV

- sv

- AC

- BAC

- EAC

- ETC

- VAC

• Formulas for earned value analysis

229

Budget and Resources

NINE

##### Earned Value Analysis (EVA)

This is an analysis method that uses earned value and other metrics to evaluate how well the project is doing relative to what was planned to date. The previous CV example is one measure, but schedule variance (SV) can also be measured, and together with other measures the project manager can determine the overall project performance against the performance measurement baseline.

#### Earned Value Management (EVM)

EVM is the practice of managing scope, schedule, and cost using earned value analysis to control the project. The results of earned value management tell the project manager what changes, if any, are needed to complete all the project's scope on time and within budget. Agile projects use earned value management with the qualification that some of the least critical scope stories may be put off to another release or a later project to meet cost and time constraints. Anywhere along the spectrum of development approaches, agreed quality requirements must be met.

#### Cost Management Overview

As you have come to expect, we will use PMI's Process Groups model to help you understand the overall Cost Management process.

#### The Examination Content Outline and Process Groups Model

Below you will see how in the Examination Content Outline (ECO), the single budget and resources management task maps to the Cost Management process in the Process Groups model. Like with scope and schedule management, the Process Groups model has processes related to Planning and Monitoring and Control, but not to executing. This is because the team does the work of spending time and budgetary resources to build the scope of the product while the project manager monitors and controls that work—equivalent to the "manage" part of "Plan and manage budget and resources" in the ECO Process domain. Note that this ECO task also includes managing physical, or material, resources.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//08a761d2-2d0b-4e2b-a601-a4b139bd1137/markdown_3/imgs/img_in_image_box_90_550_748_717.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A53Z%2F-1%2F%2F6f8c8b83bde5a56a56e65a0f726275362af61956be41f492e1dc84183a636748" alt="Image" width="80%" /></div>


#### Process Groups Model

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//08a761d2-2d0b-4e2b-a601-a4b139bd1137/markdown_3/imgs/img_in_image_box_89_751_137_809.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A54Z%2F-1%2F%2F374dedc45c46c0d3e4da62ab4ddc82180fb56d8848f50a11a6c1bd520ffe686c" alt="Image" width="5%" /></div>


Think About It. Estimating is initially done during planning, and EVM is used to control costs (and resources and procurement) throughout the project. As you manage costs you will also:

• Manage conflict and negotiate project agreements (domain I, tasks 1 and 8)

• Promote team performance through training and the use of emotional intelligence (domain 1, tasks 5 and 14).

These all support value-driven delivery and cost savings. What can you add to this list of interactions between processes and ECO tasks? Practice thinking holistically by scanning the ECO for other tasks that work in unison with these. Think about how decisions around financial resources might affect procurements, project risks, and other project constraints. Some material resources, like equipment, for example, may be available within the organization or may be procured for the project. These decisions influence how the project is planned across all constraints and how work will be completed. If you haven't had to deal with these concerns on your own projects, it's easy to miss questions on the exam about how cost-related decisions could impact the rest of the project.

230

NINE

Budget and Resources

Figure 9.1 can help you visualize the cost management process from the Process Groups model perspective, which can help you understand, in general, cost management no matter a project's development approach. Take time to review it before moving on to the rest of this chapter.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//08a761d2-2d0b-4e2b-a601-a4b139bd1137/markdown_4/imgs/img_in_image_box_126_176_661_499.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A54Z%2F-1%2F%2Fd726c484181a167804d112e4510303f461314afc8a5a695c44b623c2fdc50f43" alt="Image" width="65%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 9.1 Cost management process</div> </div>


#### Desired Outcomes From Successful Budget and Resources Management

Assume for the exam that project budget and resources are properly planned and managed unless information in an exam question indicates otherwise. This means that the following outcomes should be expected as a result of successful communications management:

- Budget strategies on the project are planned and executed according to the needs of the project. This results in few or no problems that cause the need to increase the budget baseline. Risk planning helps with this goal because most risks will have planned contingency plans and budgets built into the project budget.

- Good servant leadership in the management of the team should have the outcome that the project has on it a qualified, motivated, and high-functioning team. This team will have the support and training needed to build and deliver the project's deliverables at the appropriate levels of quality and within the project budget.

#### Plan and Estimate Project Costs

Besides having a plan for how costs will be managed, the project manager also needs to estimate costs and determine the budget. The Plan Cost Management process involves answering questions such as, “How will I go about planning cost for the project and who needs to be involved?” and “How will I effectively manage the project to the cost baseline and manage variances?”

The project charter includes the high-level cost constraint and other available requirements regarding cost management on the project. Organizational process assets used in this process include cost data and lessons learned from previous projects as well as organizational standards and policies for estimating and budgeting.

Process Groups Model

Process Groups Model

PG: Planning

Process: Plan Cost Management;

Estimate Costs

ECO

Domain II

Task 5 Plan & manage budget/resources

PMBOK* Guide

Domain 2.4 Planning

Domain 2.8 Uncertainty

231

Budget and Resources

NINE

#### Plan Cost Management

In some organizations, cost planning may involve determining whether the project will be paid for with the organization's existing funds or will be funded through equity or debt. It can also include decisions about how to finance project resources—such as choosing whether to purchase or lease equipment. As the project manager gets detailed estimates and develops the budget, calculations are used that were created for project selection (covered in the "Foundations" chapter), like net present value (NPV), return on investment (ROI), payback period, and discounted cash flow. With these the project manager evaluates whether the project is still feasible within the charter and whether the measurable project objectives can be achieved.

The cost management plan can be formal or informal, but it is part of the project management plan. It may include the following:

• Specifications for how estimates should be stated (in what currency)

• Levels of estimate precision needed

• Approved estimating techniques

• Roles and responsibilities for various cost activities (e.g., estimating, tracking, reporting)

• Reporting formats

• Whether costs will include indirect costs (not directly attributable to one project, like overhead)

• Guidelines for establishing a cost baseline to measure against

• Methods for documenting costs

• Control thresholds (amount of allowable variation before the project manager needs to act)

• Rules for measuring cost performance

• Cost change control procedures

• Information on control accounts or other ways to monitor spending

• Funding decisions

• Guidelines for dealing with potential fluctuations in resource costs and exchange rates

##### Estimate Costs

The process of estimating project costs involves estimating individual components and then aggregating all estimates into a time-phased spending plan (detailed next in Determine Budget).

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//50ec84c7-956d-4884-acfe-93a7da1b2e7f/markdown_0/imgs/img_in_image_box_74_663_122_717.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A49Z%2F-1%2F%2Faa6e0e2d9b9ec2892cf75a0961ff2d303ff8705c2244afa66c1e8d855f2ed9ac" alt="Image" width="5%" /></div>


Think About It. In the “Schedule” chapter there is a checklist called “Things to Know about Estimating for the Exam” on page 197. Take some time now to review that list since it applies to estimating schedule and cost. It is helpful to have those concepts fresh in your mind before continuing.

So what costs should be estimated? In addition to labor and material resources and training for the project, the project manager also estimates the following:

• Labor costs for all project activities or tasks

• Project management activities

• Material resources to complete activities or tasks

• Physical spaces used directly for the project

• Training

• Quality efforts

• Overhead costs, as applicable (those indirect costs like management salaries and general office expenses)

• Risk efforts

##### Types of Cost

In the past, the exam has included questions regarding types of cost. A cost can be either variable or fixed, direct or indirect—and these two pairs are not mutually exclusive. For example, there can be both direct variable costs and direct fixed costs.

• Variable costs These change with the amount of production work. Examples Materials, supplies, wages.

• Fixed costs These do not change as production changes. Examples Rent, utilities.

232

Budget and Resources

• Direct costs These are directly attributable to work on the project.

Examples Team wages, training, travel and recognition expenses; project materials costs.

- Indirect costs These are overhead costs incurred for the benefit of more than one project. Examples Taxes, fringe benefits, janitorial services.

#### Artifacts Needed to Estimate Costs

We all would agree wed want our estimates to be as accurate as possible. Where is the first place you would look for help with this? Previous, similar projects! Imagine having a repository of all the previous WBSs for similar projects, along with the estimates and actual costs for each activity. Can you see how that might be helpful in creating more accurate estimates on your own projects? Other historical project artifacts include:

• Resource requirements documentation

• Templates and processes including those from

• Cost and quality management plans

Past projects

• Scope and schedule baselines

• Lessons learned and risk registers

• Corporate governance

* Marketplace conditions, commercial cost databases,

• Policies and historical records related to estimating exchange rates, inflation, and supply sources

#### Estimating Methods and Accuracy

As described in the “Schedule” chapter, estimates should be created from ranges as it is very unlikely an activity’s completion will result in a single, exact estimated time or cost. Estimating is done using common methods like analogous, parametric, and three-point estimating.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//50ec84c7-956d-4884-acfe-93a7da1b2e7f/markdown_1/imgs/img_in_image_box_44_477_94_535.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A49Z%2F-1%2F%2F7cb1b3ae6df7e512ed72e89d39368261ffab152d271b4f6c8e77759cbc875bd4" alt="Image" width="6%" /></div>


Think About It. From a general perspective, these methods fall into the top-down or bottom-up categories. For example, say someone walks into your office and asks you to estimate the total cost of a new project. The first question you may ask is, "How accurate do you want me to be?" Early in the project during initiating, estimates are top-down, high-level estimates. Over time, as you break down project deliverables during planning, you narrow the estimate range as you do bottom-up estimating.

Top-down and bottom-up estimating each have the following advantages and disadvantages:



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td colspan="2">Top-Down (Analogous) Estimating</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Advantages</td><td style='text-align: center; word-wrap: break-word;'>Disadvantages</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Quick</td><td style='text-align: center; word-wrap: break-word;'>• Low accuracy level</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Activities and material resources do not need to be identified</td><td style='text-align: center; word-wrap: break-word;'>• Reflects limited information about the project or key deliverables</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Less costly to create</td><td style='text-align: center; word-wrap: break-word;'>• Requires considerable experience to do well</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• In initiating, provides cost constraints to evaluate high-level project feasibility</td><td style='text-align: center; word-wrap: break-word;'>• Conflicts to gain budget priorities may not have the data able to justify the need</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Overall project costs can be capped for this type of estimate</td><td style='text-align: center; word-wrap: break-word;'>• Difficult for projects with uncertainty or without similar projects to reference</td></tr><tr><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>• Does not consider differences between projects</td></tr></table>

#### Bottom-up Estimating

##### Advantages

• Based on detailed project and deliverable analyses

##### Disadvantages

• More accurate (at the activity or task level)

• Gains buy-in from the team because the team helps create the estimates

• Requires that the project be well defined and understood

• Provides a basis for control and management

• Requires effort to break project deliverables into smaller pieces

• Takes relatively more time and money

• Risk of padded estimates unless the team understands the use of reserves

233

Budget and Resources

NINE

Estimate Ranges The standard estimate range types are order of magnitude, budget, and definitive. Using each implies a particular level of accuracy. These are discussed below:

- Rough order of magnitude (ROM) estimate Usually made during initiating, a typical range for ROM estimates is -25 to +75 percent. It varies depending on how much is known about the project.

- Budget estimate A refinement from a ROM estimate, a budget estimate is typically in the range of -10 to +25 percent The range is narrowed from ROM before reiterating the budget.

- Definitive estimate As planning progresses, the estimate should become even more refined. Some project managers use the range of  $ \pm 10 $ percent, while others use -5 to +10 percent, and this may depend on what management requires.

What you see here may be different from your experience. For the exam, make sure you understand estimating in ranges and that estimates become more refined as project planning progresses. Remember that organizations have different rules for the acceptable estimate range for an activity or the project. It is wise to estimate in a range, based on the level of uncertainty remaining in the estimate.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//50ec84c7-956d-4884-acfe-93a7da1b2e7f/markdown_2/imgs/img_in_image_box_82_298_137_350.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A50Z%2F-1%2F%2F565929c21aad330f7eebebfb9328bc3fa51557461141e864f86bdf57e03fd84c" alt="Image" width="6%" /></div>


Even the approved baseline may be expressed as a range.

Example：“$1,000,000 (-5 to +10 percent).”

#### Human and Material Resource Cost Rates

It may seem obvious that resource costs involve estimating the work of consultants, sellers, and equipment and supplies. Although many project managers do not have access to this information on their projects, the exam assumes a project manager also uses the actual cost of internal human resources when performing cost estimating.

##### Estimating Costs: Final Notes

Spreadsheets and software within the PMIS can speed up calculation and analysis and integrate finance and accounting. Quality, risk, and scheduling tools are useful here as well. Alternatives analysis, reserve analysis, and decision making (all discussed in the “Schedule” chapter) may also be used as part of the Estimate Costs process.

The Estimate Costs process results in cost estimates and the basis of the estimates (an explanation of how the estimates were derived). It can also result in project document updates, such as the risk register, assumption log, and lessons learned register.

Once the project manager has completed estimating costs they have the costs for each work package or story based on the activities needed to build them, the documentation on the basis of estimates (what are their assumptions, etc), and other project artifact updates like those to the assumption log and the lessons learned and risk registers.

#### Determine Budget

The project manager aggregates the total estimated costs (including estimated risk reserves) for the project to determine the cost baseline. An approved budget includes that baseline plus a management reserve (more on reserves in the "Risks and Issues" chapter). The traditional projects 'cost baseline is a measure of project success. The project manager uses it to control costs while the project work is being done.

The project manager also revisits the feasibility of the project in determining the budget during planning. They review the business case and the benefits management plan. The business case may be expressed in financial terms such as expected return on investment (ROI). The benefits management plan can be used to compare the estimated budget to the business value the project is supposed to bring to the organization and its stakeholders.

Process Groups Model

PG: Planning

Process: Determine Budget

ECO

Domain II

Task 5 Plan & manage budget/resources

PMBOK* Guide

Domain 2.4 Planning

234

NINE

Budget and Resources

Let's review the planning process as it culminates in getting to this point with the projects' cost baseline. Here the project manager has done the following:

• In initiating, incorporated the information provided (through top-down estimating) into a project charter, which became a basis for planning since planning and executing must remain true to the project charter.

• Determined the project scope—both what is and what is not included in the project. This becomes the scope baseline.

- Decomposed product scope into deliverables and then smaller, more manageable pieces (like activities or tasks) for the purpose of estimating, assigning resources, and building that scope.

.coms.

• Calculated the aggregate project costs for the project using the estimates for each of the product scope components (bottom-up estimating). Remember that materials costs may appear in line items separate from team resources assigned to activities.

• Assigned time estimates to each activity along a network diagram to help establish the project’s critical path and the project schedule baseline.

To finish the budget the project manager will include estimated risk reserves (included in the cost baseline) and management reserves (part of the budget but not the cost baseline; see figure 9.2).

##### Future Performance Measurement

Once risk planning is included (see the "Risk and Issues" chapter), the project manager has the projects performance measurement baseline: the scope, schedule, and cost baselines. We cover performance measurement in more detail in the following Control Costs section of this chapter.

##### Adaptive Estimating Methods

On adaptive projects the team breaks down scope using t-shirt sizing, affinity estimating, and Planning Poker*. The team uses story maps to plan releases. Refer to the “Schedule” chapter for a review of these concepts. A story map is analogous to a network diagram, but do not take the analogy too far. The resulting schedules and budgets approved for traditional projects are thought to be more fixed, where a release map is meant to give a general idea of how the product releases will unfold. Agile projects do tend to fix cost and time while varying scope, but if a customer decides to drop some features as the product is developed during early releases, this will inevitably affect the project’s costs. Adaptive teams also use retrospectives to determine the accuracy of budget estimates and whether budget adjustments should be made.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//50ec84c7-956d-4884-acfe-93a7da1b2e7f/markdown_3/imgs/img_in_image_box_643_527_691_584.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A50Z%2F-1%2F%2F104ef103e7f77f32b2a27be02016cb96643e65295f701fb72968da6e29fcd049" alt="Image" width="5%" /></div>


#### Artifacts of Determine Budget

Two artifacts of Estimate Costs—cost estimates and the basis of estimates—are essential inputs to the Determine Budget process. Many of the inputs to Estimate Costs are used here as well:

• Cost management plan

• Scope baseline

• Project schedule model

• Risk register

• Existing policies on cost control and cost budgeting

- Resource requirements documentation (for example, for how long and at what costs for particular resources, including materials, supplies, and equipment costs)

• Agreements (regarding the purchase of services or products for the project)

255

Budget and Resources

NINE

##### Aggregating Costs into a Budget

To prepare the budget for approval, the project manager needs to do what's called cost aggregation. To do this, they would pull together the costs of all activities—including risk management activities, which go into the budget as risk reserves (covered in the "Risk" chapter).

Think About It. Review the following list and follow along with the Figure 9.2. Read the figure from the bottom up as you think about the items in this list:

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//50ec84c7-956d-4884-acfe-93a7da1b2e7f/markdown_4/imgs/img_in_image_box_81_190_131_250.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A51Z%2F-1%2F%2Ff9eeb2bc673f7b310a47d2c77af6f45950c4d582cc0be3d20c4d7b5c0f80e5e9" alt="Image" width="6%" /></div>


1. Activity estimates are rolled up into work package estimates (see #2).

2. Work package estimates are rolled up to control account estimates (see #3).

3. Control account estimates track entities that cost will be assigned to (and do not affect totals).

4. Project estimates is a total for the budget, to this point.

5. Contingency reserves are established during risk planning. When added here, contingency reserves determine the cost baseline (#6).

6. Cost baseline An estimated total cost performance measurement baseline.

7. Management reserves are added in the final step.

8. Cost budget is a total that includes the cost baseline + management reserves.

Notes: 1) Estimated costs and reserves are shown aggregated at the cost budget level and depicted in figure 9.2, but remember contingency reserves are added at the activity level and work package levels initially during planning for risk management. 2) It is the management reserve (covered in the "Risk" chapter) that makes the difference between the cost baseline and the budget.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//50ec84c7-956d-4884-acfe-93a7da1b2e7f/markdown_4/imgs/img_in_image_box_169_494_631_839.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A48%3A51Z%2F-1%2F%2Fc965e9ea759714293fe5cee3f44a6a1f9b6c72cb8e2cfd0ffe108716d953fc75" alt="Image" width="56%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 9.2 Aggregating costs to create a budget</div> </div>


After the cost baseline and budget are estimated, the project manager may compare these numbers to parametric estimates or to expert judgment, or perform an historical information review, comparing their estimates to those of past, similar projects. For example, a general rule for a high-level parametric estimate in some industries is that design should be 15 percent of the cost of construction. Other industries estimate the cost of design to be 60 percent of the project budget. The project manager needs to investigate and justify any significant differences between the project estimates and the reference data to ensure the estimates are reasonable and as accurate as possible.

236

NINE

Budget and Resources

Cash Flow, Financing, and Budget Reconciliation

For the exam, a well-planned, approved budget assumes that the project manager has worked with the performing organizations' finance department to ensure that cash flow planning for the organization will include expenditures for the project just when they are needed. The cost baseline, therefore, is time-phased.

Example Equipment costing $500,000 is scheduled to be purchased on June 1 but the money for the purchase is not available until July 1. The activities dependent on that equipment will have to be moved to later points in the schedule. Burn rate on agile projects Are you familiar with the term "bum rate"? It is a common business metric referring to the rate at which an entity—in this case an agile team—is using (or losing) money. You may remember that on adaptive projects, teams are often stable and consistent because more value is placed on retaining project knowledge and keeping together a team that has already developed its high-performance capabilities. One advantage of stable teams is that there are consistent burn rates and simplified cost estimating. As discussed in the "Schedule" chapter, agile teams use velocity to help create a project schedule based on story point estimates. Velocity can help anticipate future budgetary issues as well.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_0/imgs/img_in_image_box_678_207_727_265.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A50Z%2F-1%2F%2F048661794b883beb31413630e0ffa4ce8b3e6256093df22168eee9f969383798" alt="Image" width="5%" /></div>


<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_0/imgs/img_in_image_box_49_336_99_393.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A50Z%2F-1%2F%2F3d689d731ce3cbe87d7dc844a1dbee47f1ae609197b12918100c918cd651749f" alt="Image" width="6%" /></div>


Think About It. A team is averaging 50 story points per month and there are 500 story points left in the backlog. They would need 10 more months to complete the project. If their salary burn rate is 45,000 per month, can you estimate the cost for the 10 months?

It is  $ 10 \times \45,000 = \450,000 $. Knowing this, you can look at the budget and decide if you have correctly estimated a budget for 10 more months of the team's monthly salary burn rate.

##### Checking with the Project Charter

The project budget must be reconciled with any cost constraints in the charter. If the project estimate exceeds these constraints, the project manager must meet with the sponsor, explain why their cost requirement cannot be met, and propose options to decrease costs. If that cannot be done, the project's budget baseline must be increased. Pay particular attention to these last two sentences. As with the schedule, project managers have a professional responsibility to reconcile the budget in this way.

When the Determine Budget process is complete, the cost baseline, including all funding requirements, is established. Naturally, many of the inputs to the process will be updated, for example the cost estimates, the risk register, and the project schedule.

#### Control Costs and Resources

Once the project cost measurement baseline and budget are complete, the project manager will need to continuously look for anything that affects that baseline even if it can cause the project to be terminated. Start this section by completing the following exercise and imagine how this would apply to real-world projects.

Think of yourself as a detective looking for anything that can get in the way of project success. This mindset will help you select the best choice when answering questions on the exam that may seem to have more than one correct answer.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_0/imgs/img_in_image_box_54_773_109_828.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A50Z%2F-1%2F%2F4a800b4d92664cf76e75403997c08bdf0c8d9e92a0e0d15e3b36a33d091ffba1" alt="Image" width="6%" /></div>


For more information on controlling resources, be sure to read these free articles on the RMC Resources page (rmcis.com/rmc-resources): “Controlling Resources Checklist,” “Resource Responsibilities for the Project Manager,” and “Resources and the Project Budget.”

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_0/imgs/img_in_image_box_416_858_498_938.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A50Z%2F-1%2F%2Faf37a40108943ae35b714f0ca0719cb4957e928b74865ad2c0864af23f4f066a" alt="Image" width="9%" /></div>


Process Groups Model

PG: Monitoring and Controlling

Process: Control Costs

Domain II

ECO

Control Resources

RMC RESOURCES

Task 5 Plan & manage budget/resources

PMBOK* Guide

Domain 2.6 Delivery Performance

Domain 2.7 Measurement

cls.com/rmc-resources

Domain 2.8 Uncertainty

257

Budget and Resources

NINE

### 9.1 Exercise

This is an important topic so be sure to take your time to think this through. In your Exercise Notebook, list the actions a project manager may take to control costs and resources.

#### Answer

• Follow the cost and resource management plans for how to control costs

• Tailor control activities to the needs of the project

- Consider policies, procedures, tools, and reporting templates and formats related to controlling costs (selected from organizational process assets during planning)

• Measure project performance and compare it against the plan

• Determine if variances require change, including preventive and corrective action

• Request changes

• Implement approved changes

• Prevent unnecessary changes

• Look for the root cause of factors causing costs to rise

• Conduct earned value measurement

• Conduct reserve analysis (related to risk)

• Aggregate data, analyze it, and produce reports

#### Managing Change

Controlling costs is an important responsibility for project managers, but you must also understand and plan for potential budget variations. No matter how well the project manager plans in a predictive environment, change is inevitable. In adaptive environments, changes to scope are more frequent so agile teams have built in methods to handle changes throughout the project and meanwhile try to preserve the original budget if possible. Change management is covered in more detail in the "Integration" chapter. In any case, it should go without saying that changes to the cost baseline must be made formally with approval.

Think About It. Your team worked overtime to complete a new feature for an upcoming sponsor demo. While the new feature was completed on time, the overtime work means your monthly budget goal for payroll will be missed. As the project manager, you weighed the value of this through an analysis of benefits and costs. The benefit outweighed the cost, so you approved the overtime. You need to revisit this decision, casting the future of the project. Was this months higher payroll atypical or has your team consistently when forecasting the future of the project. Was this months higher payroll atypical or has your team consistently needed overtime hours to complete the necessary work? Should you adjust the budget for future months or adjust the schedule to avoid unnecessary overtime?

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_1/imgs/img_in_image_box_77_666_131_730.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A50Z%2F-1%2F%2Fe9311e735c20023eee117f80394f09c25b007e2387d1fff526ebb50a0d2e1b96" alt="Image" width="6%" /></div>


<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_1/imgs/img_in_image_box_79_808_132_865.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A50Z%2F-1%2F%2F6fae07c693f7e8df4b42071d1acc386ba840fbf6d5dafe1f5478cb8b077466b9" alt="Image" width="6%" /></div>


Think About It. What would happen if a team member suddenly realizes the materials they need to finish an activity are out of stock? More will have to be ordered. Time will be lost to waiting for the materials and last-minute order is likely to be more costly than if the materials had been better controlled.

There can be many unplanned scenarios that impact the project budget, and additional costs may be unavoidable. As the project manager, you should look for these situations, anticipate the potential risks, and plan ahead. You will never be able to foresee everything, but if you try to imagine the unplanned costs on your project, you will have a much easier time planning and managing a realistic budget.

238

NINE

Budget and Resources

#### Progress Reporting

Through earned value measurement, the project manager analyzes data about project progress to help control the schedule and costs and to assess whether the project is on track (described later in this section). Progress reports convey information based on this data analysis method. Asking team members for percent complete of their deliverables may be used by some project managers but this does not convey a realistic estimate of progress. They can carefully track progress using percent complete at the work package or story level but the cost and schedule estimates for the work package or story should also be factored in.

In terms of data gathering, an often-cited metric on traditional projects is that 80 hours is a small enough work increment to track progress against and still have accurate data. For the exam, remember that traditional projects using proper project management make use of a WBS, and activities to produce work packages are broken down to an appropriate level for controlling. Material resources like equipment usually appear in the budget as separate line items, and may even be related to costs detailed in procurement documents. For more information on the relationship of costs and resources, see the "Resources on Projects" article on the RMC Resources webpage.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_2/imgs/img_in_image_box_670_236_750_315.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A51Z%2F-1%2F%2F89b7dfe8fa01f4e960a65643c92d9e02dc8ddef904472c3938150033a4d7d74b" alt="Image" width="9%" /></div>


cls.com/

On agile projects, data gathering and analysis will be centered around the backlog and how many features have been developed to date relative to what was planned. Story points by iteration are tracked for the team's use and burnup and burndown charts are used for both the team and other stakeholders. Review these types of reports in figure 6.6 in the "Build and Support Team Performance" chapter.

RMC RESOURCES

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_2/imgs/img_in_image_box_686_349_736_405.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A51Z%2F-1%2F%2F20c01f7cf4c7844dc6fde597f93a1b2548b8f2acdd05b0fb357f9b28161e19e4" alt="Image" width="6%" /></div>


#### Reserve Analysis

Remember the contingency reserves that get factored into the cost baseline to address known risks? Reserve analysis allows you to identify and apply lessons learned in controlling costs. Part of cost control is analyzing where contingency reserves are still necessary or where new reserves are required. Both of the following examples would require a formally approved change request.

Example A project team identifies a highly ranked risk and sets aside a contingency reserve to address it. If the risk does not occur and is no longer a threat, the contingency reserve can be removed from the cost baseline.

Example A risk review on a project identifies new risks, which could lead to a decision to increase the contingency reserves.

Think About it. A formally approved change request is also required to move management reserve funds into the cost baseline for a similar purpose. It may also be necessary to reassess the amount of management reserve that was set aside to address unknown risks. This difference between contingency reserves (for identified risks) and management reserves (for unknown risks) is an important distinction that can help you get more questions right on the exam. We have mentioned this distinction earlier in this chapter and discuss it again in the "Risks and Issues" chapter.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_2/imgs/img_in_image_box_76_645_128_706.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A51Z%2F-1%2F%2Fe302303fdf6fe27974a05bee8582772ee58880b6bd4bbff935a86445a027482e" alt="Image" width="6%" /></div>


#### Earned Value Management

As a project manager, you manage project performance and you account for that performance to stakeholders by comparing planned to actual results. This is the essence of earned value management, which includes earned value analysis. Earned value analysis is a data analysis method used to evaluate project performance against the entire performance measurement baseline (the scope, schedule, and cost baselines). Earned value analysis results indicate whether there are any potential deviations from the performance measurement baseline.

Earned value analysis can be used to forecast future performance and project completion dates and costs. This information is conveyed to stakeholders through reports in meetings and other communication methods.

239

Budget and Resources

NINE

##### Formulas for Earned Value Analysis

As of this book's publication, very few questions on the exam contain formulas. Nevertheless, you should go through this section carefully. Even if you get few or no formula questions, earned value analysis is on the exam and understanding this content will help you get those questions right. Of course, memorizing the formulas we specify in this section will help you with questions requiring you to calculate formulas, even if there are not many.

Are you worried about it? Don't be. We are going to make it easier. First, think about this: How valuable would it be to know how your project is really going? Could you sleep better at night? Would you be able to spend your time in more productive ways than worrying? Keep the benefits of the earned value analysis method in mind as you read this section.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_3/imgs/img_in_image_box_76_261_127_320.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A52Z%2F-1%2F%2F49b2ebb9f94f49ee3152699b58aa852bf426459bd50cba1ba7cc4d88a7c3096d" alt="Image" width="6%" /></div>


'Think About It: Terms to Know. Here are the earned value terms you need to know.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Acronym</td><td style='text-align: center; word-wrap: break-word;'>Term</td><td style='text-align: center; word-wrap: break-word;'>Interpretation</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>PV</td><td style='text-align: center; word-wrap: break-word;'>Planned value</td><td style='text-align: center; word-wrap: break-word;'>As of today, what is the estimated value of the work planned to be done?</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>EV</td><td style='text-align: center; word-wrap: break-word;'>Earned value</td><td style='text-align: center; word-wrap: break-word;'>As of today, what is the estimated value of the work actually accomplished?</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>AC</td><td style='text-align: center; word-wrap: break-word;'>Actual cost (total cost)</td><td style='text-align: center; word-wrap: break-word;'>As of today, what is the actual cost incurred for the work accomplished?</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>BAC</td><td style='text-align: center; word-wrap: break-word;'>Budget at completion (the cost baseline)</td><td style='text-align: center; word-wrap: break-word;'>How much did we budget for the total project effort?</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>EAC</td><td style='text-align: center; word-wrap: break-word;'>Estimate at completion</td><td style='text-align: center; word-wrap: break-word;'>What do we currently expect the total project to cost (a forecast)?</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>ETC</td><td style='text-align: center; word-wrap: break-word;'>Estimate to complete</td><td style='text-align: center; word-wrap: break-word;'>From this point on, how much more do we expect it to cost to finish the project (a forecast)?</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>VAC</td><td style='text-align: center; word-wrap: break-word;'>Variance at completion</td><td style='text-align: center; word-wrap: break-word;'>As of today, how much over or under budget do we expect to be at the end of the project?</td></tr></table>

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//fe748055-c20e-4bb5-9d1a-9ddf92673daf/markdown_3/imgs/img_in_image_box_76_634_126_690.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A47%3A52Z%2F-1%2F%2Fe91ebc8d9f6a57ae358cb566c73308c03833f7a9117b404113fe4334dc7ef4ef" alt="Image" width="6%" /></div>


Think About It: Formulas and Interpretations to Memorize. On the exam, you may not need to perform many calculations but you must understand what the numbers mean. Therefore, you should know and understand all the formulas in the following table.

240

NINE

Budget and Resources



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Name</td><td style='text-align: center; word-wrap: break-word;'>Formula</td><td style='text-align: center; word-wrap: break-word;'>Interpretation</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Cost variance (CV)</td><td style='text-align: center; word-wrap: break-word;'>EV-AC</td><td style='text-align: center; word-wrap: break-word;'>Negative is over budget; positive is under budget.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Schedule variance (SV)</td><td style='text-align: center; word-wrap: break-word;'>EV-PV</td><td style='text-align: center; word-wrap: break-word;'>Negative is behind schedule; positive is ahead of schedule.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Cost performance index (CPI)</td><td style='text-align: center; word-wrap: break-word;'>$ \frac{EV}{AC} $</td><td style='text-align: center; word-wrap: break-word;'>We are getting  \_\_\_ worth of work out of every  1 spent. Funds are or are not being used efficiently. Greater than one is good; less than one is bad.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Schedule performance index (SPI)</td><td style='text-align: center; word-wrap: break-word;'>$ \frac{EV}{PV} $</td><td style='text-align: center; word-wrap: break-word;'>We are (only) progressing at \_\_\_ percent of the rate originally planned. Greater than one is good; less than one is bad.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Estimate at completion (EAC)</td><td style='text-align: center; word-wrap: break-word;'>AC + Bottom-up ETC</td><td style='text-align: center; word-wrap: break-word;'>As of now, how much do we expect the total project to cost?  $ \S $  $ \blacksquare $</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>NOTE: There are many ways to calculate EAC, depending on the assumptions made. Notice how the purpose of the formulas really is to create forecasts based on past performance of the project. Exam questions may require you to determine which EAC formula is appropriate. Pay attention to the information provided in the question. It will help you determine which formula to use.</td><td style='text-align: center; word-wrap: break-word;'>$ \frac{BAC}{CPIC} $</td><td style='text-align: center; word-wrap: break-word;'>This formula calculates actual costs to date plus a revised estimate for all the remaining work. It is used when the original estimate was fundamentally flawed. This formula is used if no variances from the BAC have occurred or if you will continue at the same rate of spending (as calculated in your cumulative CPI or based on the trends that have led to the current CPI). This formula calculates actual costs to date plus remaining budget. It is used when current variances are thought to be atypical of the future. It is essentially AC plus the remaining value of work to perform. This formula calculates actual to date plus the remaining budget modified by performance. It is used when current variances are thought to be typical of the future and when project schedule constraints will influence the completion of the remaining effort. So for example, it might be used when the cumulative CPI is less than one and a firm completion date must be met.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>To-complete performance index (TCPI)</td><td style='text-align: center; word-wrap: break-word;'>$ \frac{AC}{BAC-EV} $  $ \frac{(CPIC \times SPIF)}{AC} $</td><td style='text-align: center; word-wrap: break-word;'>This formula divides the value of the work remaining to be done by the money remaining to do it. It answers the question &quot;To stay within budget, what rate do we need to meet for the remaining work?&quot; Greater than one is bad; less than one is good.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Estimate to complete (ETC)</td><td style='text-align: center; word-wrap: break-word;'>$ \frac{BAC-EV}{BAC-AC} $</td><td style='text-align: center; word-wrap: break-word;'>How much more will the project cost?</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>NOTE: You can determine ETC by either using the formula listed here or reestimating the cost of the work remaining.</td><td style='text-align: center; word-wrap: break-word;'>Reestimate</td><td style='text-align: center; word-wrap: break-word;'>This formula calculates the total project cost as of today minus what has been spent to date.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Variance at completion (VAC)</td><td style='text-align: center; word-wrap: break-word;'>BAC - EAC</td><td style='text-align: center; word-wrap: break-word;'>How much over or under budget will we be at the end of the project?</td></tr></table>

241

Budget and Resources

NINE

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//5587d9a6-650d-4c88-b767-da278cb8acfb/markdown_0/imgs/img_in_image_box_90_104_144_158.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A00Z%2F-1%2F%2F1dd2c27e12cbcc0f244ad947698b079127999811e0fb0fed1bd51479fce1c838" alt="Image" width="6%" /></div>


The following should help solidify your understanding about CV, SV, CPI, and SPI:

• EV comes first in each of these formulas.

- Ở ít is a variance ^aference; me rormuia is tv minus AL or rv.

• If it is an index (ratio), the formula is EV divided by AC or PV.

• If the formula relates to cost, use AC.

• If the formula relates to schedule, use PV.

• For variances interpretation: Negative is bad (J) and positive is good (S).

Example A -200 cost variance means you spent more than planned @ (are over budget). A -200 schedule variance means you are behind schedule @. This also applies to VAC.

• For indices interpretation: Greater than one is good Q) and less than one is bad (v). Remember, this only applies to CPI and SPI. The opposite is true of TCPI.

#### Understanding Earned Value Terminology

People often incorrectly answer exam questions requiring them to simply interpret earned value terms without having to calculate formulas. This section is an opportunity to help you get those questions right.

Think About it. Sometimes thinking about things in a different way can give you that “aha” moment when everything falls into place. Think about the following bulleted lists and figure 9.3. Together they illustrate the terminology to help you see it from another angle. Then, if you are still uncomfortable with earned value concepts put it aside for now. However, come back another day and review all the content from the “Earned Value Management” section of this book. Sometimes new information takes a bit of extra effort and this area is certainly in that category for many students.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//5587d9a6-650d-4c88-b767-da278cb8acfb/markdown_0/imgs/img_in_image_box_81_429_131_489.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A00Z%2F-1%2F%2F9db17a9b2837adf7f96f0927584b3767bf3f5a86bcfe5ea3f73a1ae0342c348b" alt="Image" width="6%" /></div>


Planned value (PV) and actual cost (AC) look backward at what has been done on the project:

• P V: What is the expected value of work done at this point in the project (according to the plan)?

• AC: What has the actual cost been on the project to this point?

Budget at completion (BAC), estimate to complete (ETC), and estimate at completion (EAC) look forward at the project:

- BAC refers to the projects currently approved budget. It is a known quantity indicating what the end cost of the project would be if everything went according to plan.

- ETC and EAC forecast future performance based on what has actually been done on the project, considering variances from the plan the project has already experienced.

• ETC is an estimate of how much more the remainder of the project will cost to complete.

- EAC indicates what the total project cost is forecasted to be.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//5587d9a6-650d-4c88-b767-da278cb8acfb/markdown_0/imgs/img_in_image_box_182_785_648_974.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A00Z%2F-1%2F%2F7723865d50f09896115a458c2f28e62300d35739906aae66b22805e56833679e" alt="Image" width="56%" /></div>


<div style="text-align: center;"><div style="text-align: center;">FIGURE 9.3 Earned value concepts by looking backward and forward on a project</div> </div>


242

NINE

Budget and Resources

##### Earned Value in Action

Earned value is an effective tool for measuring performance and determining the need to request changes. The following is a sample team conversation on this subject.

The project manager calls a team meeting and says, “We are six months into this million-dollar project, and my latest analysis shows a CPI of 1.2 and an SPI of 0.89. This means we are getting 1.2 dollars for every dollar we put into the project, but only progressing at 89 percent of the rate originally planned. Let’s look for options to correct this problem.”

The network specialist suggests that she could be removed from the project team and replaced with someone less expensive. The IT coordinator suggests either removing the purchase of new computers from the project or telling the customer the project will be two weeks late.

The project manager looks at the network specialist and says, “It would sadden me to lose you, and your suggestion would improve costs but not schedule. You are the company’s best network specialist. Someone else would not be as proficient as you in completing the work.” To the IT coordinator’s suggestion, the project manager responds that canceling the new computers would save money but not time. “Let’s focus on time.”

Another team member suggests that since the project is doing well on cost, the project manager could bring in another programmer from the IT department to work on the project to get the next two activities completed more quickly.

The project manager says, “That sounds like the most effective choice in this situation. Let’s see if we can find someone who will improve performance, at the lowest cost. Thanks for your help.”

#### Earned Value Analysis Practice

The best way to learn the earned value analysis technique is to use it. The following exercises are designed to give you a chance to practice both calculations and interpretation. Earned value questions on the exam have generally required fewer calculations per question than these exercises.

### 9.2 Exercise

The cost performance index (CPI) and the schedule performance index (SPI) can be charted each month to show the project trends. Based on the diagram, would you be more concerned about cost or schedule if you were taking over this project from another project manager? Write the answer in your Exercise Notebook.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-15//5587d9a6-650d-4c88-b767-da278cb8acfb/markdown_1/imgs/img_in_chart_box_145_620_613_903.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-05-20T17%3A49%3A01Z%2F-1%2F%2F2bb763aa537e0bf26e439a927969e60a296f6952834a64c197fb62478df7d0e7" alt="Image" width="56%" /></div>


243

Budget and Resources

NINE

#### Answer

You should be more concerned about schedule. The data in the chart is historical. Ihe last, most current measurement was in the fourth quarter, which shows both SPI and CPI being above one (good). As of the fourth quarter, the SPI is lower. An easy way to answer performance index questions that ask whether cost or schedule should concern you most is to pick the option with the lowest index.

### 9.3 The Fence Exercise

You have a project to build a new fence. The fence has four sides equal in length. Each side is to take one day to build, and $1,000 has been budgeted per side. The sides are planned to be completed one after the other. Today is the end of day 3.

Using the information in the project status chart, calculate the following in your Exercise Notebook. Interpretation is important on the exam. Can you interpret what each answer means?



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>1.PV=</td><td style='text-align: center; word-wrap: break-word;'>5. CV=</td><td style='text-align: center; word-wrap: break-word;'>9. EAC=</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>2. EV=</td><td style='text-align: center; word-wrap: break-word;'>6. CPI=</td><td style='text-align: center; word-wrap: break-word;'>10. ETC=</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>3.AC=</td><td style='text-align: center; word-wrap: break-word;'>7. SV=</td><td style='text-align: center; word-wrap: break-word;'>II.VAC=</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>4. BAC=</td><td style='text-align: center; word-wrap: break-word;'>8. SPI=</td><td style='text-align: center; word-wrap: break-word;'></td></tr></table>

<div style="text-align: center;"><div style="text-align: center;">Project Status Chart</div> </div>




<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td colspan="2">Activity Day 1</td><td colspan="3">Day 2 Day 3 Day 4 Status End of Day 3</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Side 1</td><td style='text-align: center; word-wrap: break-word;'>S. $ ..... $F</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Side 2</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>S. $ ..... $PF</td><td style='text-align: center; word-wrap: break-word;'>$ - $F</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Side 3</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>PS-S- $ PF $</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td rowspan="2">Side 4</td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'>PS- $ ..... $PF</td></tr><tr><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td><td style='text-align: center; word-wrap: break-word;'></td></tr></table>

Key S = Actual Start, F = Actual Finish, PS = Planned Start, and PF = Planned Finish

244

NINE Budget and Resources

### Answer: The Fence Exercise



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'></td><td colspan="2">What Is: Calculation</td><td colspan="2">Answer Interpretation of the Answer</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>1.</td><td style='text-align: center; word-wrap: break-word;'>PV</td><td style='text-align: center; word-wrap: break-word;'>$1,000 plus $1,000 plus $1,000</td><td style='text-align: center; word-wrap: break-word;'>$3,000</td><td style='text-align: center; word-wrap: break-word;'>We should have done $3,000 worth of work.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>2.</td><td style='text-align: center; word-wrap: break-word;'>EV</td><td style='text-align: center; word-wrap: break-word;'>Complete, complete, and half done; or $1,000 plus $1,000 plus $500</td><td style='text-align: center; word-wrap: break-word;'>$2,500</td><td style='text-align: center; word-wrap: break-word;'>We have actually completed $2,500 worth of work.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>3.</td><td style='text-align: center; word-wrap: break-word;'>AC</td><td style='text-align: center; word-wrap: break-word;'>$1,000 plus $1,200 plus $600</td><td style='text-align: center; word-wrap: break-word;'>$2,800</td><td style='text-align: center; word-wrap: break-word;'>We have actually spent $2,800.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>4.</td><td style='text-align: center; word-wrap: break-word;'>BAC</td><td style='text-align: center; word-wrap: break-word;'>$1,000 plus $1,000 plus $1,000 plus $1,000</td><td style='text-align: center; word-wrap: break-word;'>$4,000</td><td style='text-align: center; word-wrap: break-word;'>Our project budget is $4,000.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>5.</td><td style='text-align: center; word-wrap: break-word;'>CV</td><td style='text-align: center; word-wrap: break-word;'>$2,500 minus $2,800</td><td style='text-align: center; word-wrap: break-word;'>-$300</td><td style='text-align: center; word-wrap: break-word;'>We are over budget by $300.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>6.</td><td style='text-align: center; word-wrap: break-word;'>CPI</td><td style='text-align: center; word-wrap: break-word;'>$2,500 divided by $2,800</td><td style='text-align: center; word-wrap: break-word;'>0.893</td><td style='text-align: center; word-wrap: break-word;'>We are only getting about 89 cents out of every dollar we put into the project.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>7.</td><td style='text-align: center; word-wrap: break-word;'>SV</td><td style='text-align: center; word-wrap: break-word;'>$2,500 minus $3,000</td><td style='text-align: center; word-wrap: break-word;'>-$500</td><td style='text-align: center; word-wrap: break-word;'>We are behind schedule.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>8.</td><td style='text-align: center; word-wrap: break-word;'>SPI</td><td style='text-align: center; word-wrap: break-word;'>$2,500 divided by $3,000</td><td style='text-align: center; word-wrap: break-word;'>0.833</td><td style='text-align: center; word-wrap: break-word;'>We are only progressing at about 83 percent of the rate planned.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>9.</td><td style='text-align: center; word-wrap: break-word;'>EAC</td><td style='text-align: center; word-wrap: break-word;'>$4,000 divided by $0,893</td><td style='text-align: center; word-wrap: break-word;'>$4,479</td><td style='text-align: center; word-wrap: break-word;'>We currently estimate that the total project will cost $4,479.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>10.</td><td style='text-align: center; word-wrap: break-word;'>ETC</td><td style='text-align: center; word-wrap: break-word;'>$4,479 minus $2,800</td><td style='text-align: center; word-wrap: break-word;'>$1,679</td><td style='text-align: center; word-wrap: break-word;'>We need to spend an additional $1,679 to finish the project.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>11.</td><td style='text-align: center; word-wrap: break-word;'>VAC</td><td style='text-align: center; word-wrap: break-word;'>$4,000 minus $4,479</td><td style='text-align: center; word-wrap: break-word;'>-$479</td><td style='text-align: center; word-wrap: break-word;'>We currently expect to be $479 over budget when the project is completed.</td></tr></table>

Did you select the correct EAC formula? If not, did you miss information in the question that could have guided you to the correct formula? In this example, side 2 cost $1,200. Side 3 is SO percent complete and has cost $600. This suggests a trend that indicates side 4 is likely to cost $1,200 when complete. When there is a trend and no other information to indicate the trend will not continue, it's most appropriate to use the BAC/CPI formula.

Understanding the meaning of earned value analysis calculations is as important as knowing how to calculate them. Expect questions on the exam such as:

Example “The CPI is 0.9, and the SPI is 0.92. What should you do?”

The data show the project as both over budget and behind schedule (J). You need to interpret this and other data in the question and then determine which choice would address the issue(s) described.

### 9.4 Exercise

What is the SPI if the CV is $10,000, the SV is -$3,000, and the PV is $100,000? Write the answer in your Exercise Notebook.

245

Budget and Resources

NINE

#### Answer

To find the SPI here, you need to perform two calculations. The formula for SPI is  $ SPI = EV/PV $. We know what the PV is, but we don't know the EV. Luckily, we can figure it out using the information given in the question. We're given the SV and PV, so we can use the following reverse formula to determine EV.

Reverse formula: EV = SV + PV.

EV = $3,000 + $100,000 = $97,000.

Now we can plug the PV and EV into the SPI formula as follows:

SPI = EV/PB = $97000/$ 100,000 = .97

### 9.5 Exercise

What is the AC if the CV is $10,000 and the EV is $97,000? Write the answer in your Exercise Notebook.

#### Answer



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Answer. The CV is 10,000 and the EV is 97,000. With this information, we can determine the AC by using the formula  $ CV = EV - AC $. We first plug the information we know into the formula.</td><td style='text-align: center; word-wrap: break-word;'>Known formula:  $ CV = EV - AC $</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>To solve for AC, we need to get AC alone on one side of the equation. First, add AC to both sides of the equation:</td><td style='text-align: center; word-wrap: break-word;'>$  \10,000 + AC = \97,000 - AC + AC  $</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>The -AC and +AC on the right-hand side of the equation canceled each other out. But we still need to isolate AC on the left-hand side of the equation. To do this, we&#x27;re going to subtract 10,000 from both sides.</td><td style='text-align: center; word-wrap: break-word;'>$  \10,000 + AC - \10,000 = \97,000 - \10,000  $;  $  AC = \87,000  $</td></tr></table>

#### Summary: Earned Value Analysis and Managing Costs

Whew! You made it. In summary, earned value analysis enables the project manager and team to identify and analyze trends in performance and variances. The information gleaned from earned value analysis allows the project manager and team to know how the project is performing at a given point in time and to report on this performance and also provide forecasts for the future of the project. Indications may require action to bring the project in line with what was planned, or formally approved changes to the performance measurement baseline, which may require additional funds for the project.

Control Costs also includes monitoring the use of contingency reserves to ensure the amount of reserves remaining is adequate.

#### Putting It All Together

Did you recognize the estimating tools that were also used in the “Schedule” chapter? The project manager uses estimating tools to create the budget for the project. Remember that meeting the cost baseline will be a measure of project success, so the budget should be in a form the project manager can use to control costs while the work is being done. During Monitoring and Controlling, the project manager uses earned value measurement to measure project performance against the performance measurement baseline.

For the exam, make sure you understand the difference between the different types of reserves (contingency vs. management). You may get 1-3 questions on the exam that require you to use a formula. It's best if you at least know formulas for SV, CV, CPI, and SPI, and understand what those formulas are measuring.

246

NINE

Budget and Resources

Revisit the Quicktest at the beginning of this chapter. Do you still have gaps in your knowledge? Go through the chapter again to review the areas you are still unsure about. Then complete the following chapter review.

### 9.6 Exercise

Read the following case study and review the table to see some examples of what the project manager will do during each of the Cost Management processes.

The city council reviewed a high-level recommendation for the new library (considered the charter for this project). The project manager (PM) reviews the recommendation to plan and develop a more detailed cost estimate along with a schedule.

- The (PM) knows that talking with the architect and construction team leader will help formulate cost estimates.

• Understanding the size and interest rate of the debt will factor into needed funds and scheduling urgency.

• Talking with the mayor will determine how and when to effectively report progress against the budget as the mayor will have final signoff on the budget.

• The PM will ask for clarity on spending authorizations and change orders.

- Reviewing results from the city's last building project will provide insights into costs, risks, and potential resources.

- The city manager will help with reviewing and controlling the budget, as this manager will be responsible for project procurement.

- To track costs, the PM will use the city's financial reporting system, recording all expenditures within a month of their paid dates.

• The PM will create monthly financial reports of expenditures and earned value.

• Any unexpected costs or change orders, over the city authorization policy covering the PM, must be approved by the city manager or mayor.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td colspan="2">Cost Process Examples of the PM&#x27;s work</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Plan cost</td><td style='text-align: center; word-wrap: break-word;'>• Plan to talk with architect and head of construction about costs</td></tr><tr><td rowspan="5">management</td><td style='text-align: center; word-wrap: break-word;'>• Plan to talk with major about frequency of reporting expenditures</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Review the lessons learned from the prior city building project</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Review the expected debt amount with associated interest payments</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Learn about PM&#x27;s authority for expenditures and changes to budget</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Get access to city financial system</td></tr><tr><td rowspan="2">Estimate costs</td><td style='text-align: center; word-wrap: break-word;'>• Talk with involved stakeholders; review price estimates of needed resources</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Get estimates for several completion dates to compare the time vs. cost considerations</td></tr><tr><td rowspan="2">Determine budget</td><td style='text-align: center; word-wrap: break-word;'>• Present two different budget options to the city council for approval, answer questions as needed.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• After council budget selection, prepare the final budget and schedule for the city manager to review. Adjust as needed and get signoff.</td></tr><tr><td rowspan="3">Control costs</td><td style='text-align: center; word-wrap: break-word;'>• Enter expenditures into city financial system within one month of payments.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Monthly reporting of total expenditures, including earned value analysis.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>• Extra expenditures over PM authorization must be approved by mayor or manager.</td></tr></table>

247

Budget and Resources

NINE

### 9.7 Exercise

Ulis exercise uses agile processes for the library case study. Read the scenario below and then complete the exercise by writing down the meanings of the given terms. Look up any terms for which you do not know the meaning, and do write them down. Writing them will help you learn them better than just reading them will.

For the first set of releases, a team of 5 product developers will be assigned for a period of 6 months (besides the product owner and project manager). Their goal will be to offer as many features to library patrons as can be released in 6 months, based on the product owners (head librarians) priority and other stakeholder feedback.

• The team will work in two-week iterations with releases every quarter.

- The PM will track team velocity and report which features patrons value most, compared with the time required to create them.

- At the end of the 6 months, the PM will present accomplishments to management along with the product owner's recommendation for next steps.

Hands-on: Define the following terms, either here or in your Exercise Notebook.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Term</td><td style='text-align: center; word-wrap: break-word;'>Definition</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Release</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Product Owner</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Iteration</td><td style='text-align: center; word-wrap: break-word;'></td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Velocity</td><td style='text-align: center; word-wrap: break-word;'></td></tr></table>

#### Answer

The wording of your answers may not match these exactly, but should be substantively the same.



<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td style='text-align: center; word-wrap: break-word;'>Term</td><td style='text-align: center; word-wrap: break-word;'>Definition</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Release</td><td style='text-align: center; word-wrap: break-word;'>A version of the product that is useful to the user and that can be delivered</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Feature</td><td style='text-align: center; word-wrap: break-word;'>A particular, defined aspect of the product that is useful to the user.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Product Owner</td><td style='text-align: center; word-wrap: break-word;'>The person who decides on the priority of feature development based on expected value to users and cost and time to complete.</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Iteration</td><td style='text-align: center; word-wrap: break-word;'>A timebox used to complete work on a product (for example, a “two-week iteration”).</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>Velocity</td><td style='text-align: center; word-wrap: break-word;'>A calculated rate of work completed per iteration, usually measured in story points.</td></tr></table>

248