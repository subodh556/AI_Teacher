```mermaid
graph TD
    %% Task nodes with priority color coding
    classDef critical fill:#ff6b6b,color:white;
    classDef high fill:#4ecdc4,color:white;
    classDef medium fill:#ffd166,color:black;
    classDef low fill:#83c5be,color:black;

    %% Tasks
    T1[TASK-001: Project Initialization]
    T2[TASK-002: Supabase Integration]
    T3[TASK-003: Clerk Authentication]
    T4[TASK-004: Prisma ORM Setup]
    T5[TASK-005: Layout Structure]
    T6[TASK-006: Core UI Components]
    T7[TASK-007: State Management]
    T8[TASK-008: Route Implementation]
    T9[TASK-009: API Endpoints]
    T10[TASK-010: Assessment System]
    T11[TASK-011: AI Learning Engine]
    T12[TASK-012: Progress Tracking]
    T13[TASK-013: Gamification System]

    T15[TASK-015: Code Execution Environment]
    T16[TASK-016: Accessibility]
    T17[TASK-017: Mobile Responsiveness]
    T18[TASK-018: Testing Setup]
    T19[TASK-019: Vercel Deployment]
    T20[TASK-020: Analytics Integration]

    %% Dependencies
    T1 --> T2
    T1 --> T3
    T1 --> T5
    T1 --> T18

    T2 --> T4
    T2 --> T9
    T2 --> T10
    T2 --> T11
    T2 --> T12
    T2 --> T13

    T4 --> T9
    T4 --> T10
    T4 --> T11
    T4 --> T12
    T4 --> T13

    T5 --> T6
    T5 --> T7
    T5 --> T16
    T5 --> T17

    T6 --> T7
    T6 --> T8
    T6 --> T10
    T6 --> T12
    T6 --> T13

    T6 --> T15
    T6 --> T16
    T6 --> T17

    T7 --> T8

    T9 --> T10
    T9 --> T11
    T9 --> T12
    T9 --> T13

    T9 --> T15

    T10 --> T11

    T12 --> T13

    T1 --> T19
    T19 --> T20

    %% Apply classes based on priority
    class T1,T2,T3,T4 critical;
    class T5,T6,T7,T8,T9,T10,T11 high;
    class T12,T13,T15,T16,T17,T18 medium;
    class T19,T20 low;
```
