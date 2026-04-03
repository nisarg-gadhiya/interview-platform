import CSFundamental from '../models/csFundamental.model.js'

const sampleTopics = [
    // OS topics
    {
        subject: 'OS',
        title: 'Process Management',
        content: `Process management is a fundamental concept in operating systems. A process is an instance of a program in execution.

Key concepts:
- Process States: New, Ready, Running, Waiting, Terminated
- Process Control Block (PCB): Contains process state, program counter, memory limits
- Context Switching: Saving and restoring process context
- Process Scheduling: CPU scheduling algorithms like FCFS, Priority, Round Robin`,
        keyPoints: [
            'Process is an executing instance of a program',
            'Each process has its own memory space and resources',
            'Operating system manages process lifecycle',
            'CPU scheduling determines process execution order'
        ],
        examples: [
            'Example 1: FCFS Scheduling\nProcesses: P1(8ms), P2(4ms), P3(2ms)\nOrder: P1 -> P2 -> P3\nTotal wait time: (0) + (8) + (12) = 20ms',
            'Example 2: Round Robin (Time Quantum = 4ms)\nP1: [4ms] -> [4ms] ✓\nP2: [4ms] ✓\nP3: [2ms] ✓'
        ],
        difficulty: 'Medium',
        tags: ['scheduling', 'cpu', 'concurrency'],
        sourceAttribution: 'Internal'
    },
    {
    subject: 'OS',
    title: 'Process vs Thread',
    content: `A process is an independent program in execution.

Key concepts:
- Memory: Processes have separate address spaces
- Communication: Processes use IPC
- Overhead: Process creation is expensive
- Fault Isolation: If one process crashes, others survive
- Parallelism: Threads enable better CPU utilization`,
    
    keyPoints: [
        'Processes are isolated and secure but expensive',
        'Threads are lightweight and faster but less secure',
        'Context switching is slower for processes than threads',
        'Multithreading improves performance for I/O-bound tasks'
    ],
    
    examples: [
        'Example 1: Web Browser\nEach tab runs as a separate process',
        'Example 2: Multithreaded Server\nHandles multiple requests using threads'
    ],
    
    difficulty: 'Medium',
    tags: ['process', 'thread', 'multithreading'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Process Scheduling',
    content: `Process scheduling is the mechanism by which the operating system decides which process gets access to the CPU and for how long. The goal is to optimize CPU utilization, minimize waiting time, and ensure fairness among processes.

Scheduling can be:
- Non-preemptive: Once a process starts executing, it cannot be interrupted (e.g., FCFS, SJF non-preemptive)
- Preemptive: OS can interrupt a running process to give CPU to another (e.g., Round Robin, Priority preemptive)

Key algorithms:
- FCFS (First Come First Serve): Processes are executed in the order they arrive. Simple but suffers from convoy effect where short jobs wait behind long ones
- SJF (Shortest Job First): Executes the process with the smallest burst time. Minimizes average waiting time but requires prior knowledge of burst time
- Priority Scheduling: Each process is assigned a priority. High-priority processes execute first. Can lead to starvation of low-priority processes
- Round Robin: Each process gets a fixed time quantum in cyclic order. Ensures fairness and is widely used in time-sharing systems

Important metrics:
- Turnaround Time = Completion Time - Arrival Time
- Waiting Time = Turnaround Time - Burst Time
- Response Time = First Response - Arrival Time`,
    keyPoints: [
        'Scheduling improves system performance and responsiveness',
        'Preemptive scheduling is more flexible than non-preemptive',
        'Round Robin prevents starvation but increases context switching',
        'SJF gives optimal waiting time but is difficult to implement practically'
    ],
    examples: [
        'Example 1: FCFS\nProcesses: P1(10ms), P2(2ms)\nP2 waits unnecessarily long → convoy effect',
        'Example 2: Round Robin (q=2)\nP1(5), P2(3)\nExecution cycles between processes ensuring fairness'
    ],
    difficulty: 'Medium',
    tags: ['scheduling', 'cpu', 'algorithms'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Context Switching',
    content: `Context switching is the process of saving the state (context) of a currently running process or thread and restoring the state of another process so that execution can resume from the same point later.

The context includes:
- Program Counter (next instruction to execute)
- CPU Registers
- Stack Pointer
- Process State
- Memory Management Information

Steps involved:
1. Save the current process state into its PCB
2. Update process state (Running → Ready/Waiting)
3. Select next process using scheduling algorithm
4. Load the new process context from its PCB
5. Resume execution

Triggers:
- Timer interrupt (time slice over)
- I/O interrupt
- System calls

Context switching introduces overhead because CPU does not perform useful work during switching.`,
    keyPoints: [
        'Essential for multitasking and time-sharing systems',
        'Stored in Process Control Block (PCB)',
        'Frequent switching reduces CPU efficiency',
        'Faster in threads compared to processes'
    ],
    examples: [
        'Example 1: While downloading a file, user opens another app → OS switches CPU between tasks',
        'Example 2: Round Robin scheduling triggers frequent context switches after each quantum'
    ],
    difficulty: 'Medium',
    tags: ['context-switch', 'cpu', 'process'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Inter-Process Communication (IPC)',
    content: `IPC is a mechanism that allows processes to communicate and synchronize their actions. Since processes have separate address spaces, direct communication is not possible without IPC.

Two main models:
1. Shared Memory:
   - Processes share a common memory region
   - Fast because no kernel involvement after setup
   - Requires synchronization (mutex/semaphore) to avoid race conditions

2. Message Passing:
   - Processes communicate by sending messages
   - Can be direct or indirect (via mailbox)
   - Safer but slower due to system calls

Common IPC mechanisms:
- Pipes: Unidirectional communication (parent-child)
- Named Pipes (FIFO): Allows unrelated processes to communicate
- Message Queues: Messages stored in queue
- Shared Memory: Fastest IPC
- Sockets: Used for communication over networks`,
    keyPoints: [
        'IPC is required because processes are isolated',
        'Shared memory is fastest but complex to manage',
        'Message passing is simpler but slower',
        'Synchronization is crucial to avoid race conditions'
    ],
    examples: [
        'Example 1: Producer-Consumer problem using shared buffer',
        'Example 2: Linux command → ls | grep txt uses pipe for communication'
    ],
    difficulty: 'Medium',
    tags: ['ipc', 'communication', 'process'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Deadlock',
    content: `Deadlock is a situation in which a group of processes are blocked because each process is holding at least one resource and waiting for another resource held by another process.

Necessary conditions (Coffman conditions):
1. Mutual Exclusion: Resources cannot be shared
2. Hold and Wait: Process holds resources while requesting more
3. No Preemption: Resources cannot be forcibly taken
4. Circular Wait: Circular chain of processes waiting for resources

Handling deadlocks:
1. Prevention:
   - Break one of the four conditions
   - Example: Prevent hold-and-wait by requesting all resources at once

2. Avoidance:
   - Use algorithms like Banker’s Algorithm
   - System checks if allocation leads to safe state before granting

3. Detection:
   - Allow deadlock to occur, then detect using resource allocation graph

4. Recovery:
   - Terminate processes or preempt resources

Safe State:
- A system is in a safe state if there exists a sequence in which all processes can complete execution without deadlock`,
    keyPoints: [
        'Deadlock occurs due to improper resource allocation',
        'All four Coffman conditions must hold simultaneously',
        'Banker’s Algorithm is used for avoidance',
        'Prevention reduces flexibility, detection allows more concurrency'
    ],
    examples: [
        'Example 1: P1 holds Resource A, waiting for B; P2 holds B, waiting for A → deadlock',
        'Example 2: Dining Philosophers problem demonstrates deadlock scenario'
    ],
    difficulty: 'Hard',
    tags: ['deadlock', 'resource-allocation', 'concurrency'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Synchronization (Mutex, Semaphore, Monitor)',
    content: `Synchronization is a mechanism used to control access to shared resources in a concurrent system. When multiple processes or threads access shared data, it can lead to inconsistencies known as race conditions. Synchronization ensures that only one process accesses critical resources at a time.

Key mechanisms:
- Mutex (Mutual Exclusion):
  A locking mechanism that allows only one thread to access a resource at a time. If a thread locks the mutex, others must wait until it is released.

- Semaphore:
  A signaling mechanism using an integer variable.
  Types:
  • Binary Semaphore (0/1) → similar to mutex
  • Counting Semaphore → allows multiple processes to access resources

- Monitor:
  A high-level synchronization construct that encapsulates shared variables, procedures, and synchronization logic. It automatically ensures mutual exclusion and uses condition variables for waiting and signaling.

Synchronization prevents:
- Race conditions
- Data inconsistency
- Concurrent access issues`,
    keyPoints: [
        'Mutex allows only one thread in critical section',
        'Semaphore uses counters to manage access',
        'Monitor is a high-level abstraction for synchronization',
        'Essential for safe multithreading'
    ],
    examples: [
        'Example 1: Mutex\nThread 1 locks resource → Thread 2 waits → Thread 1 unlocks → Thread 2 proceeds',
        'Example 2: Semaphore (count=2)\nTwo processes can access resource simultaneously; third must wait'
    ],
    difficulty: 'Hard',
    tags: ['synchronization', 'mutex', 'semaphore', 'monitor'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Critical Section Problem',
    content: `The critical section problem deals with designing a protocol that ensures that when one process is executing in its critical section, no other process is allowed to execute in its critical section simultaneously.

A critical section is the part of the code where shared resources (variables, files, memory) are accessed.

Structure of a process:
1. Entry Section → Request access
2. Critical Section → Access shared resource
3. Exit Section → Release resource
4. Remainder Section → Rest of code

Requirements for a correct solution:
- Mutual Exclusion: Only one process in critical section
- Progress: If no process is inside, one should be allowed to enter
- Bounded Waiting: No process should wait indefinitely

Failure leads to:
- Race conditions
- Data corruption`,
    keyPoints: [
        'Critical section accesses shared resources',
        'Mutual exclusion is mandatory',
        'Ensures fairness and avoids starvation',
        'Solved using locks, semaphores, monitors'
    ],
    examples: [
        'Example 1: Two threads updating a shared counter without lock → incorrect value',
        'Example 2: Bank account withdrawal → without synchronization leads to wrong balance'
    ],
    difficulty: 'Hard',
    tags: ['critical-section', 'race-condition', 'concurrency'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Memory Management',
    content: `Memory management is the process of controlling and coordinating computer memory, assigning portions to processes while optimizing performance.

Key responsibilities:
- Allocation & Deallocation: Assigning memory to processes
- Address Binding: Mapping logical addresses to physical addresses
- Protection: Preventing unauthorized access
- Sharing: Allowing controlled access among processes

Types of memory:
- Logical Address Space (virtual)
- Physical Address Space (RAM)

Techniques:
- Contiguous Allocation
- Paging
- Segmentation
- Virtual Memory

Goals:
- Maximize CPU utilization
- Minimize fragmentation
- Efficient memory usage`,
    keyPoints: [
        'OS manages RAM allocation efficiently',
        'Virtual memory extends physical memory',
        'Ensures protection and isolation',
        'Uses paging and segmentation techniques'
    ],
    examples: [
        'Example 1: Program larger than RAM runs using virtual memory',
        'Example 2: Multiple processes share memory safely using OS control'
    ],
    difficulty: 'Medium',
    tags: ['memory', 'virtual-memory', 'allocation'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Paging',
    content: `Paging is a memory management technique that divides both logical and physical memory into fixed-size blocks called pages and frames respectively.

Working:
- Logical memory → divided into pages
- Physical memory → divided into frames
- Page table maps pages to frames

Address format:
- Page number + Offset

Advantages:
- Eliminates external fragmentation
- Efficient memory utilization

Disadvantages:
- Internal fragmentation (unused space in page)
- Page table overhead

Translation:
Logical Address → Page Table → Physical Address`,
    keyPoints: [
        'Memory divided into fixed-size pages',
        'Page table maps logical to physical memory',
        'No external fragmentation',
        'Internal fragmentation may occur'
    ],
    examples: [
        'Example: Page size = 4KB\nLogical address = 5000 → Page = 1, Offset = 904',
        'Page table maps page 1 → frame 3 → physical address calculated'
    ],
    difficulty: 'Medium',
    tags: ['paging', 'memory', 'virtual-memory'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Segmentation',
    content: `Segmentation is a memory management technique that divides memory into variable-sized segments based on logical divisions such as functions, objects, or data structures.

Each segment has:
- Base address (starting point)
- Limit (length)

Address format:
- Segment number + Offset

Advantages:
- Reflects logical structure of program
- Easier sharing and protection

Disadvantages:
- External fragmentation
- Complex memory management

Segmentation allows:
- Separate handling of code, data, and stack
- Better modular programming`,
    keyPoints: [
        'Memory divided into variable-sized segments',
        'Matches logical program structure',
        'Supports protection and sharing',
        'Causes external fragmentation'
    ],
    examples: [
        'Example: Segment 0 = code, Segment 1 = data, Segment 2 = stack',
        'Logical address (1, 200) → refers to data segment offset 200'
    ],
    difficulty: 'Medium',
    tags: ['segmentation', 'memory', 'addressing'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Virtual Memory',
    content: `Virtual memory is a memory management technique that allows a system to use disk space as an extension of RAM. It enables programs to run even if they are larger than the available physical memory.

Working:
- Only required parts (pages) of a program are loaded into RAM
- Remaining parts stay in secondary storage (disk)
- When needed, pages are brought into RAM (page fault)

Key concepts:
- Demand Paging: Load pages only when required
- Page Fault: Occurs when a page is not in memory
- Swap Space: Disk area used for virtual memory

Advantages:
- Efficient memory utilization
- Supports large programs

Disadvantages:
- Slower than RAM
- Excessive page faults lead to thrashing`,
    keyPoints: [
        'Extends RAM using disk space',
        'Uses demand paging technique',
        'Page fault occurs when page is missing in memory',
        'Improves multitasking and memory utilization'
    ],
    examples: [
        'Example: A 10GB program runs on 4GB RAM using virtual memory',
        'Example: When accessing a missing page → OS loads it from disk'
    ],
    difficulty: 'Medium',
    tags: ['virtual-memory', 'paging', 'memory'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Thrashing',
    content: `Thrashing is a condition in which the system spends more time swapping pages in and out of memory than executing actual processes. It occurs when there is insufficient memory and too many page faults.

Causes:
- High degree of multiprogramming
- Insufficient RAM
- Poor page replacement algorithm

Effects:
- CPU utilization drops
- System performance degrades significantly

Solution:
- Reduce number of processes
- Increase RAM
- Use better page replacement algorithms`,
    keyPoints: [
        'Occurs due to excessive page faults',
        'CPU spends time on swapping instead of execution',
        'Reduces system performance drastically',
        'Can be controlled by limiting processes'
    ],
    examples: [
        'Example: Multiple large programs running → constant page swapping',
        'Example: System becomes slow despite CPU being idle'
    ],
    difficulty: 'Medium',
    tags: ['thrashing', 'memory', 'performance'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Page Replacement Algorithms',
    content: `Page replacement algorithms determine which page should be replaced when a new page needs to be loaded into memory.

Types:
- FIFO (First In First Out):
  Oldest page is replaced first. Simple but may lead to Belady’s anomaly.

- LRU (Least Recently Used):
  Replaces the page that has not been used for the longest time. More efficient but requires tracking usage.

- Optimal:
  Replaces the page that will not be used for the longest time in future. Gives best performance but not practical.

Goals:
- Minimize page faults
- Improve memory utilization`,
    keyPoints: [
        'Used when memory is full and new page is needed',
        'FIFO is simple but inefficient',
        'LRU is practical and widely used',
        'Optimal gives best results but cannot be implemented'
    ],
    examples: [
        'Example: Page sequence → 1,2,3,1,4\nFIFO replaces oldest page',
        'Example: LRU removes least recently accessed page'
    ],
    difficulty: 'Hard',
    tags: ['paging', 'algorithms', 'memory'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'File Systems',
    content: `A file system is a method used by the operating system to store, organize, and manage data on storage devices.

Functions:
- File creation, deletion, reading, writing
- Directory management
- Access control and permissions

Types:
- FAT (File Allocation Table)
- NTFS (Windows)
- EXT (Linux)

File structure:
- File → Collection of data
- Directory → Organizes files

Allocation methods:
- Contiguous Allocation
- Linked Allocation
- Indexed Allocation`,
    keyPoints: [
        'Organizes data on storage devices',
        'Provides file access and permissions',
        'Supports hierarchical directory structure',
        'Uses allocation techniques for storage'
    ],
    examples: [
        'Example: Folder structure in Windows/Linux',
        'Example: File read/write operations using system calls'
    ],
    difficulty: 'Medium',
    tags: ['file-system', 'storage', 'os'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Disk Scheduling',
    content: `Disk scheduling algorithms determine the order in which disk I/O requests are serviced to improve efficiency and reduce seek time.

Types:
- FCFS (First Come First Serve):
  Processes requests in arrival order. Simple but inefficient.

- SSTF (Shortest Seek Time First):
  Selects request closest to current head position. Faster but may cause starvation.

- SCAN (Elevator Algorithm):
  Disk arm moves in one direction servicing requests, then reverses direction.

- C-SCAN (Circular SCAN):
  Moves in one direction only and jumps back to start, providing uniform wait time.

Goal:
- Minimize seek time
- Improve disk throughput`,
    keyPoints: [
        'Reduces disk access time',
        'SSTF improves performance but may cause starvation',
        'SCAN provides better fairness',
        'C-SCAN ensures uniform wait time'
    ],
    examples: [
        'Example: Disk head moves to nearest request in SSTF',
        'Example: Elevator-like movement in SCAN algorithm'
    ],
    difficulty: 'Medium',
    tags: ['disk', 'scheduling', 'os'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Starvation & Aging',
    content: `Starvation occurs when a process waits indefinitely for CPU or resources because other higher-priority processes keep getting executed.

Cause:
- Priority Scheduling where low-priority processes never get CPU

Solution: Aging
- Aging gradually increases the priority of waiting processes over time
- Ensures that every process eventually gets CPU

Importance:
- Prevents indefinite blocking
- Improves fairness in scheduling`,
    keyPoints: [
        'Starvation leads to indefinite waiting',
        'Occurs mainly in priority scheduling',
        'Aging increases priority over time',
        'Ensures fairness in CPU allocation'
    ],
    examples: [
        'Example: Low priority process never executes due to continuous high priority jobs',
        'Example: Aging increases its priority until it gets CPU time'
    ],
    difficulty: 'Medium',
    tags: ['starvation', 'aging', 'scheduling'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Demand Paging',
    content: `Demand paging is a technique where pages are loaded into memory only when they are required, rather than loading the entire process at once.

Working:
- Process starts execution with minimal pages
- When a required page is not in memory → page fault occurs
- OS loads page from disk into RAM

Advantages:
- Reduces memory usage
- Faster program startup

Disadvantages:
- Page fault overhead
- May lead to thrashing if excessive`,
    keyPoints: [
        'Pages are loaded only when needed',
        'Uses lazy loading technique',
        'Reduces memory consumption',
        'Page faults are a key part of this mechanism'
    ],
    examples: [
        'Example: Opening a large application loads only initial pages',
        'Example: Additional pages loaded as user navigates'
    ],
    difficulty: 'Medium',
    tags: ['paging', 'demand-paging', 'memory'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'TLB (Translation Lookaside Buffer)',
    content: `TLB is a special high-speed cache used to store recent translations of virtual memory addresses to physical addresses.

Working:
- CPU first checks TLB for page mapping
- If found → TLB hit (fast access)
- If not found → TLB miss → access page table

Purpose:
- Reduce memory access time
- Improve performance of paging system

Without TLB:
- Two memory accesses required (page table + data)

With TLB:
- Often only one access needed`,
    keyPoints: [
        'TLB is a cache for address translation',
        'Reduces memory access time',
        'TLB hit is fast, miss is slower',
        'Improves overall system performance'
    ],
    examples: [
        'Example: Frequently accessed pages stored in TLB',
        'Example: TLB hit avoids page table lookup'
    ],
    difficulty: 'Medium',
    tags: ['tlb', 'memory', 'paging'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Fragmentation',
    content: `Fragmentation occurs when memory is not utilized efficiently, leading to wasted space.

Types:
- Internal Fragmentation:
  Occurs when allocated memory block is larger than required, leaving unused space inside.

- External Fragmentation:
  Occurs when free memory is scattered in small blocks and cannot satisfy large requests.

Solutions:
- Paging eliminates external fragmentation
- Compaction reduces external fragmentation
- Segmentation may suffer from external fragmentation`,
    keyPoints: [
        'Internal fragmentation wastes space inside blocks',
        'External fragmentation wastes space between blocks',
        'Paging avoids external fragmentation',
        'Compaction helps reduce fragmentation'
    ],
    examples: [
        'Example: Allocating 4KB page for 3KB data → 1KB wasted (internal)',
        'Example: Free memory scattered → cannot allocate large block (external)'
    ],
    difficulty: 'Medium',
    tags: ['fragmentation', 'memory', 'allocation'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Swapping',
    content: `Swapping is a memory management technique where processes are temporarily moved from main memory (RAM) to secondary storage (disk) to free up space.

Working:
- Process moved to disk → swapped out
- Later brought back → swapped in

Purpose:
- Increase multiprogramming
- Efficient memory usage

Drawbacks:
- Slow due to disk access
- Frequent swapping reduces performance

Difference:
- Swapping moves entire process
- Paging moves only pages`,
    keyPoints: [
        'Moves processes between RAM and disk',
        'Helps manage limited memory',
        'Slow due to disk operations',
        'Different from paging (whole process vs pages)'
    ],
    examples: [
        'Example: OS swaps out inactive process to load active one',
        'Example: Background apps moved to disk when RAM is full'
    ],
    difficulty: 'Medium',
    tags: ['swapping', 'memory', 'os'],
    sourceAttribution: 'Internal'
},
    {
        subject: 'OS',
        title: 'Memory Management',
        content: `Memory management deals with managing the computer's main memory (RAM) and allocating it to processes.

Key Concepts:
- Virtual Memory: Abstraction of physical memory
- Paging: Dividing memory into fixed-size pages
- Segmentation: Dividing memory into logical segments
- Page Replacement Algorithms: LRU, FIFO, Optimal`,
        keyPoints: [
            'Virtual memory allows programs larger than physical RAM',
            'Paging divides memory into fixed-size frames',
            'Page table maps virtual addresses to physical addresses',
            'Thrashing occurs when page fault rate is high'
        ],
        examples: [
            'FIFO Page Replacement with 3 frames\nPage sequence: 7,0,1,2,0,3,0,4,2,3,0,3,2\nPage faults occur at positions requiring new pages',
            'LRU (Least Recently Used) - Keeps most recently used pages in memory'
        ],
        difficulty: 'Hard',
        tags: ['memory', 'paging', 'virtual-memory'],
        sourceAttribution: 'Internal'
    },
    {
    subject: 'OS',
    title: 'Interrupts',
    content: `An interrupt is a signal sent to the CPU that temporarily halts the current execution and transfers control to an interrupt handler to address an urgent task.

Types:
- Hardware Interrupts: Generated by devices (keyboard, mouse, I/O)
- Software Interrupts: Generated by programs (system calls, exceptions)

Working:
1. Interrupt occurs
2. CPU saves current state
3. Executes interrupt handler
4. Restores previous state and resumes execution

Purpose:
- Efficient CPU utilization
- Handling I/O operations asynchronously`,
    keyPoints: [
        'Interrupts allow CPU to handle urgent tasks',
        'CPU temporarily pauses current execution',
        'Used in I/O and real-time systems',
        'Improves responsiveness'
    ],
    examples: [
        'Example: Keyboard press generates interrupt',
        'Example: Disk I/O completion triggers interrupt'
    ],
    difficulty: 'Medium',
    tags: ['interrupts', 'cpu', 'io'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Interrupts',
    content: `An interrupt is a signal sent to the CPU that temporarily halts the current execution and transfers control to an interrupt handler to address an urgent task.

Types:
- Hardware Interrupts: Generated by devices (keyboard, mouse, I/O)
- Software Interrupts: Generated by programs (system calls, exceptions)

Working:
1. Interrupt occurs
2. CPU saves current state
3. Executes interrupt handler
4. Restores previous state and resumes execution

Purpose:
- Efficient CPU utilization
- Handling I/O operations asynchronously`,
    keyPoints: [
        'Interrupts allow CPU to handle urgent tasks',
        'CPU temporarily pauses current execution',
        'Used in I/O and real-time systems',
        'Improves responsiveness'
    ],
    examples: [
        'Example: Keyboard press generates interrupt',
        'Example: Disk I/O completion triggers interrupt'
    ],
    difficulty: 'Medium',
    tags: ['interrupts', 'cpu', 'io'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Booting Process',
    content: `Booting is the process of starting a computer and loading the operating system into memory.

Steps:
1. Power On → BIOS/UEFI runs
2. POST (Power-On Self Test) checks hardware
3. Bootloader is loaded (GRUB, Windows Boot Manager)
4. OS kernel is loaded into memory
5. System initialization completes

Types:
- Cold Boot: Starting from powered-off state
- Warm Boot: Restarting system

Purpose:
- Initialize hardware
- Load OS for execution`,
    keyPoints: [
        'Booting loads OS into memory',
        'BIOS/UEFI initializes hardware',
        'Bootloader loads kernel',
        'Essential for system startup'
    ],
    examples: [
        'Example: PC starts → BIOS → Bootloader → OS loads',
        'Example: Restarting system performs warm boot'
    ],
    difficulty: 'Easy',
    tags: ['booting', 'os', 'startup'],
    sourceAttribution: 'Internal'
},{
    subject: 'OS',
    title: 'Spooling',
    content: `Spooling (Simultaneous Peripheral Operations On-Line) is a technique where data is temporarily stored in a buffer (usually disk) to be processed later by a device.

Working:
- Jobs are stored in queue
- Device processes them sequentially

Advantages:
- Efficient device utilization
- Allows multiple jobs to queue

Common Use:
- Printing systems

Difference:
- Spooling uses disk buffer
- Buffering uses memory`,
    keyPoints: [
        'Spooling queues jobs for processing',
        'Improves device efficiency',
        'Used in printers and I/O systems',
        'Allows multitasking'
    ],
    examples: [
        'Example: Multiple print jobs queued in printer spooler',
        'Example: OS stores jobs before sending to slow devices'
    ],
    difficulty: 'Easy',
    tags: ['spooling', 'io', 'os'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OS',
    title: 'Buffering',
    content: `Buffering is a technique used to temporarily store data in memory while it is being transferred between two devices or processes with different speeds.

Types:
- Single Buffering
- Double Buffering
- Circular Buffering

Purpose:
- Smooth data flow
- Handle speed mismatch between devices

Advantages:
- Reduces waiting time
- Improves efficiency

Difference:
- Buffering uses RAM
- Spooling uses disk`,
    keyPoints: [
        'Temporary storage in memory',
        'Handles speed differences between devices',
        'Improves data transfer efficiency',
        'Used in I/O operations'
    ],
    examples: [
        'Example: Video streaming uses buffering to avoid lag',
        'Example: Keyboard input stored in buffer before processing'
    ],
    difficulty: 'Easy',
    tags: ['buffering', 'io', 'memory'],
    sourceAttribution: 'Internal'
},
    // CN topics
    {
        subject: 'CN',
        title: 'OSI Model',
        content: `The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes communication functions.

Seven Layers:
1. Physical Layer: Transmission of raw bits
2. Data Link Layer: Frames and MAC addresses
3. Network Layer: IP routing and logical addressing
4. Transport Layer: TCP/UDP and end-to-end delivery
5. Session Layer: Dialog control
6. Presentation Layer: Encryption and compression
7. Application Layer: HTTP, FTP, SMTP`,
        keyPoints: [
            'OSI model has 7 layers',
            'Each layer has specific functions',
            'Devices like switches operate at Layer 2',
            'Routers operate at Layer 3',
            'TCP/IP is a practical implementation of OSI'
        ],
        examples: [
            'Email transmission uses Layer 7 (SMTP), Layer 4 (TCP), Layer 3 (IP)',
            'Web browsing uses HTTP (L7), TCP (L4), IP (L3), Ethernet (L2)'
        ],
        difficulty: 'Easy',
        tags: ['networking', 'osi-model', 'layers'],
        sourceAttribution: 'Internal'
    },
    {
    subject: 'CN',
    title: 'TCP/IP Model',
    content: `The TCP/IP model is the practical implementation of networking used in the Internet. It simplifies the OSI model into 4 layers.

Layers:
1. Application Layer → Combines OSI's Application, Presentation, Session
2. Transport Layer → TCP/UDP for data transmission
3. Internet Layer → IP addressing and routing
4. Network Access Layer → Physical transmission and MAC

Difference from OSI:
- Fewer layers (4 vs 7)
- More practical and widely used
- OSI is theoretical, TCP/IP is real-world

Working:
- Data flows from application → transport → internet → network access
- Reverse at receiver

Protocols:
- HTTP, FTP (Application)
- TCP, UDP (Transport)
- IP (Internet)`,
    keyPoints: [
        'TCP/IP has 4 layers',
        'Used in real-world internet communication',
        'Combines multiple OSI layers',
        'Simpler and more practical than OSI'
    ],
    examples: [
        'Example: Web browsing uses HTTP (Application), TCP (Transport), IP (Internet)',
        'Example: Data travels through 4 layers before reaching destination'
    ],
    difficulty: 'Medium',
    tags: ['tcpip', 'internet', 'protocols'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'TCP vs UDP',
    content: `TCP and UDP are transport layer protocols used for data transmission.

TCP (Transmission Control Protocol):
- Connection-oriented
- Reliable (acknowledgments, retransmission)
- Ordered delivery
- Slower due to overhead

UDP (User Datagram Protocol):
- Connectionless
- Unreliable (no guarantee of delivery)
- Faster (no overhead)
- No ordering

Use Cases:
- TCP → Web browsing, file transfer
- UDP → Video streaming, gaming, DNS

Key Difference:
- TCP ensures accuracy
- UDP ensures speed`,
    keyPoints: [
        'TCP is reliable but slower',
        'UDP is fast but unreliable',
        'TCP uses acknowledgments and retransmissions',
        'UDP has minimal overhead'
    ],
    examples: [
        'Example: File download uses TCP to ensure complete data',
        'Example: Live video streaming uses UDP for speed'
    ],
    difficulty: 'Easy',
    tags: ['tcp', 'udp', 'transport'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Three-Way Handshake',
    content: `The three-way handshake is a process used by TCP to establish a reliable connection between client and server.

Steps:
1. SYN:
   Client sends SYN (synchronize) with initial sequence number

2. SYN-ACK:
   Server responds with SYN-ACK (acknowledges client + sends its own sequence number)

3. ACK:
   Client sends ACK confirming connection establishment

After this, data transmission begins.

Purpose:
- Establish connection
- Synchronize sequence numbers
- Ensure both sides are ready

Why 3 steps?
- Ensures reliability and avoids duplicate connections`,
    keyPoints: [
        'Used to establish TCP connection',
        'Involves SYN, SYN-ACK, ACK',
        'Synchronizes sequence numbers',
        'Ensures both client and server are ready'
    ],
    examples: [
        'Example: Opening a website → TCP connection established using handshake',
        'Example: Client-server communication begins after handshake'
    ],
    difficulty: 'Medium',
    tags: ['tcp', 'handshake', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Four-Way Handshake',
    content: `The four-way handshake is used to terminate a TCP connection gracefully.

Steps:
1. FIN:
   Client sends FIN (finish) to close connection

2. ACK:
   Server acknowledges FIN

3. FIN:
   Server sends its own FIN when ready

4. ACK:
   Client acknowledges and connection closes

Why 4 steps?
- TCP is full-duplex (both sides send data independently)
- Each direction must be closed separately

States:
- TIME_WAIT ensures delayed packets are handled

Purpose:
- Reliable connection termination
- Ensures all data is transmitted`,
    keyPoints: [
        'Used to terminate TCP connection',
        'Requires 4 steps due to full-duplex nature',
        'Ensures all data is transmitted before closing',
        'TIME_WAIT prevents packet issues'
    ],
    examples: [
        'Example: Closing a browser tab → TCP connection terminated',
        'Example: Server finishes sending data before closing connection'
    ],
    difficulty: 'Medium',
    tags: ['tcp', 'termination', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Four-Way Handshake',
    content: `The four-way handshake is used to terminate a TCP connection gracefully.

Steps:
1. FIN:
   Client sends FIN (finish) to close connection

2. ACK:
   Server acknowledges FIN

3. FIN:
   Server sends its own FIN when ready

4. ACK:
   Client acknowledges and connection closes

Why 4 steps?
- TCP is full-duplex (both sides send data independently)
- Each direction must be closed separately

States:
- TIME_WAIT ensures delayed packets are handled

Purpose:
- Reliable connection termination
- Ensures all data is transmitted`,
    keyPoints: [
        'Used to terminate TCP connection',
        'Requires 4 steps due to full-duplex nature',
        'Ensures all data is transmitted before closing',
        'TIME_WAIT prevents packet issues'
    ],
    examples: [
        'Example: Closing a browser tab → TCP connection terminated',
        'Example: Server finishes sending data before closing connection'
    ],
    difficulty: 'Medium',
    tags: ['tcp', 'termination', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Subnetting',
    content: `Subnetting is the process of dividing a large network into smaller sub-networks (subnets) to improve efficiency and security.

Concept:
- IP address divided into network part + host part
- Subnet mask defines this division

Benefits:
- Reduces network congestion
- Improves performance
- Enhances security
- Efficient IP utilization

CIDR:
- Uses notation like /24, /16

Formula:
- Number of hosts = 2^n - 2

Used in:
- Network design
- IP allocation`,
    keyPoints: [
        'Divides network into smaller subnets',
        'Improves performance and security',
        'Uses subnet mask for division',
        'Efficient use of IP addresses'
    ],
    examples: [
        'Example: 192.168.1.0/24 → can be split into smaller subnets',
        'Example: /26 subnet gives 62 usable hosts'
    ],
    difficulty: 'Hard',
    tags: ['subnetting', 'ip', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Subnetting',
    content: `Subnetting is the process of dividing a large network into smaller sub-networks (subnets) to improve efficiency and security.

Concept:
- IP address divided into network part + host part
- Subnet mask defines this division

Benefits:
- Reduces network congestion
- Improves performance
- Enhances security
- Efficient IP utilization

CIDR:
- Uses notation like /24, /16

Formula:
- Number of hosts = 2^n - 2

Used in:
- Network design
- IP allocation`,
    keyPoints: [
        'Divides network into smaller subnets',
        'Improves performance and security',
        'Uses subnet mask for division',
        'Efficient use of IP addresses'
    ],
    examples: [
        'Example: 192.168.1.0/24 → can be split into smaller subnets',
        'Example: /26 subnet gives 62 usable hosts'
    ],
    difficulty: 'Hard',
    tags: ['subnetting', 'ip', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Routing (Distance Vector vs Link State)',
    content: `Routing is the process of selecting the best path for data to travel from source to destination across networks.

Types of Routing Algorithms:

1. Distance Vector:
- Each router shares its routing table with neighbors
- Uses Bellman-Ford algorithm
- Example: RIP
- Problems: Slow convergence, count-to-infinity

2. Link State:
- Routers have complete network topology
- Uses Dijkstra algorithm
- Example: OSPF
- Faster and more accurate

Purpose:
- Efficient packet delivery
- Minimize delay and congestion`,
    keyPoints: [
        'Routing determines path of packets',
        'Distance Vector is simple but slower',
        'Link State is faster and more efficient',
        'Used by routers in networks'
    ],
    examples: [
        'Example: RIP uses distance vector approach',
        'Example: OSPF uses link state for faster routing'
    ],
    difficulty: 'Medium',
    tags: ['routing', 'algorithms', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'DNS (Domain Name System)',
    content: `DNS is a system that translates human-readable domain names (like google.com) into IP addresses that computers understand.

Working:
1. User enters domain name
2. Request goes to DNS resolver
3. Resolver queries root → TLD → authoritative server
4. Returns IP address

Types of DNS servers:
- Root Server
- TLD Server
- Authoritative Server

Purpose:
- Simplify internet usage
- Avoid remembering IP addresses`,
    keyPoints: [
        'Maps domain names to IP addresses',
        'Hierarchical structure of DNS servers',
        'Essential for web browsing',
        'Reduces complexity for users'
    ],
    examples: [
        'Example: google.com → 142.250.x.x',
        'Example: Browser uses DNS before sending request'
    ],
    difficulty: 'Medium',
    tags: ['dns', 'internet', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'HTTP vs HTTPS',
    content: `HTTP and HTTPS are protocols used for transferring web data between client and server.

HTTP:
- HyperText Transfer Protocol
- Not secure (data sent in plain text)
- Port 80

HTTPS:
- HTTP Secure
- Uses SSL/TLS encryption
- Port 443
- Provides confidentiality, integrity, authentication

Working:
- HTTPS encrypts data before transmission
- Prevents interception (man-in-the-middle attacks)

Importance:
- Secure communication over internet`,
    keyPoints: [
        'HTTP is insecure, HTTPS is secure',
        'HTTPS uses encryption (SSL/TLS)',
        'Protects sensitive data',
        'Widely used for secure websites'
    ],
    examples: [
        'Example: Banking websites use HTTPS',
        'Example: HTTP data can be intercepted easily'
    ],
    difficulty: 'Easy',
    tags: ['http', 'https', 'security'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'HTTP vs HTTPS',
    content: `HTTP and HTTPS are protocols used for transferring web data between client and server.

HTTP:
- HyperText Transfer Protocol
- Not secure (data sent in plain text)
- Port 80

HTTPS:
- HTTP Secure
- Uses SSL/TLS encryption
- Port 443
- Provides confidentiality, integrity, authentication

Working:
- HTTPS encrypts data before transmission
- Prevents interception (man-in-the-middle attacks)

Importance:
- Secure communication over internet`,
    keyPoints: [
        'HTTP is insecure, HTTPS is secure',
        'HTTPS uses encryption (SSL/TLS)',
        'Protects sensitive data',
        'Widely used for secure websites'
    ],
    examples: [
        'Example: Banking websites use HTTPS',
        'Example: HTTP data can be intercepted easily'
    ],
    difficulty: 'Easy',
    tags: ['http', 'https', 'security'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'NAT (Network Address Translation)',
    content: `NAT is a technique used to map private IP addresses to a public IP address, allowing multiple devices to access the internet using a single public IP.

Types:
- Static NAT → One-to-one mapping
- Dynamic NAT → Pool of public IPs
- PAT (Port Address Translation) → Multiple devices share one IP using ports

Working:
- Router modifies IP address in packet headers
- Maintains mapping table

Advantages:
- Conserves public IP addresses
- Enhances security

Disadvantages:
- Breaks end-to-end connectivity`,
    keyPoints: [
        'Maps private IPs to public IP',
        'Allows multiple devices to share internet',
        'PAT is most commonly used',
        'Adds security by hiding internal network'
    ],
    examples: [
        'Example: Home router uses NAT for all devices',
        'Example: Multiple devices share one public IP'
    ],
    difficulty: 'Medium',
    tags: ['nat', 'ip', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'NAT (Network Address Translation)',
    content: `NAT is a technique used to map private IP addresses to a public IP address, allowing multiple devices to access the internet using a single public IP.

Types:
- Static NAT → One-to-one mapping
- Dynamic NAT → Pool of public IPs
- PAT (Port Address Translation) → Multiple devices share one IP using ports

Working:
- Router modifies IP address in packet headers
- Maintains mapping table

Advantages:
- Conserves public IP addresses
- Enhances security

Disadvantages:
- Breaks end-to-end connectivity`,
    keyPoints: [
        'Maps private IPs to public IP',
        'Allows multiple devices to share internet',
        'PAT is most commonly used',
        'Adds security by hiding internal network'
    ],
    examples: [
        'Example: Home router uses NAT for all devices',
        'Example: Multiple devices share one public IP'
    ],
    difficulty: 'Medium',
    tags: ['nat', 'ip', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'DHCP (Dynamic Host Configuration Protocol)',
    content: `DHCP automatically assigns IP addresses and network configuration to devices in a network.

Working (DORA process):
1. Discover → Client broadcasts request
2. Offer → Server offers IP
3. Request → Client requests offered IP
4. Acknowledge → Server confirms allocation

Parameters assigned:
- IP address
- Subnet mask
- Gateway
- DNS server

Purpose:
- Simplify network configuration
- Avoid manual IP assignment`,
    keyPoints: [
        'Automatically assigns IP addresses',
        'Uses DORA process',
        'Reduces manual configuration',
        'Widely used in networks'
    ],
    examples: [
        'Example: Connecting to WiFi → IP assigned via DHCP',
        'Example: Router acts as DHCP server in home network'
    ],
    difficulty: 'Easy',
    tags: ['dhcp', 'network', 'ip'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Congestion Control (TCP)',
    content: `Congestion control is a mechanism used by TCP to regulate data transmission and prevent network congestion.

Concept:
- Congestion occurs when network is overloaded

Techniques:
1. Slow Start:
   - Starts with small window size
   - Doubles window each round

2. Congestion Avoidance:
   - Increases window gradually

3. Fast Retransmit:
   - Detects packet loss quickly

4. Fast Recovery:
   - Recovers without restarting slow start

Goal:
- Optimize throughput
- Avoid packet loss`,
    keyPoints: [
        'Controls traffic to prevent congestion',
        'Uses window size adjustment',
        'Slow start increases speed gradually',
        'Fast recovery improves performance'
    ],
    examples: [
        'Example: TCP increases data rate until packet loss occurs',
        'Example: Network slowdown triggers congestion control mechanisms'
    ],
    difficulty: 'Hard',
    tags: ['tcp', 'congestion', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Load Balancing',
    content: `Load balancing is a technique used to distribute incoming network traffic across multiple servers to ensure no single server is overwhelmed.

Types:
- Round Robin → Requests distributed sequentially
- Least Connections → Server with least active connections chosen
- IP Hash → Based on client IP

Types of Load Balancers:
- Layer 4 (Transport level)
- Layer 7 (Application level)

Benefits:
- Improves performance
- Ensures high availability
- Fault tolerance

Used in:
- Web servers
- Cloud systems`,
    keyPoints: [
        'Distributes traffic across servers',
        'Prevents server overload',
        'Improves availability and performance',
        'Used in scalable systems'
    ],
    examples: [
        'Example: Multiple servers handling website traffic',
        'Example: AWS Elastic Load Balancer'
    ],
    difficulty: 'Medium',
    tags: ['load-balancing', 'network', 'scaling'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'CDN (Content Delivery Network)',
    content: `A CDN is a distributed network of servers that deliver content to users based on their geographic location.

Working:
- Content cached on multiple servers worldwide
- User request served from nearest server

Benefits:
- Reduced latency
- Faster content delivery
- Reduced server load

Used for:
- Videos
- Images
- Static content

Examples:
- Cloudflare
- Akamai`,
    keyPoints: [
        'Delivers content from nearest server',
        'Reduces latency and load time',
        'Improves user experience',
        'Widely used in modern web apps'
    ],
    examples: [
        'Example: Netflix streams video using CDN',
        'Example: Images load faster due to nearby server'
    ],
    difficulty: 'Easy',
    tags: ['cdn', 'network', 'performance'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Firewall',
    content: `A firewall is a security system that monitors and controls incoming and outgoing network traffic based on predefined rules.

Types:
- Packet Filtering Firewall
- Stateful Firewall
- Application-Level Firewall (Proxy)

Functions:
- Block unauthorized access
- Allow legitimate traffic
- Protect against attacks

Placement:
- Between internal network and external network`,
    keyPoints: [
        'Controls network traffic based on rules',
        'Protects system from unauthorized access',
        'Can be hardware or software based',
        'Essential for network security'
    ],
    examples: [
        'Example: Blocking specific ports to prevent attacks',
        'Example: Firewall prevents unauthorized login attempts'
    ],
    difficulty: 'Easy',
    tags: ['firewall', 'security', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'SSL/TLS',
    content: `SSL (Secure Sockets Layer) and TLS (Transport Layer Security) are cryptographic protocols used to secure communication over a network.

Working:
- Uses encryption (symmetric + asymmetric)
- Performs handshake to establish secure connection
- Exchanges keys securely

Features:
- Encryption → Data confidentiality
- Integrity → Prevent tampering
- Authentication → Verify server identity

Used in:
- HTTPS
- Secure communication`,
    keyPoints: [
        'Provides secure communication over internet',
        'Uses encryption techniques',
        'TLS is modern version of SSL',
        'Used in HTTPS protocol'
    ],
    examples: [
        'Example: Lock icon in browser indicates HTTPS (TLS)',
        'Example: Online payments use SSL/TLS encryption'
    ],
    difficulty: 'Medium',
    tags: ['ssl', 'tls', 'security'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Socket Programming',
    content: `Socket programming is a method used to establish communication between two devices over a network using sockets.

Concept:
- Socket = endpoint for communication
- Identified by IP address + Port number

Types:
- TCP Socket → Reliable communication
- UDP Socket → Fast but unreliable

Steps:
1. Create socket
2. Bind to address
3. Listen (server)
4. Accept connection
5. Send/receive data

Used in:
- Client-server applications`,
    keyPoints: [
        'Enables communication between devices',
        'Uses IP and port for identification',
        'TCP sockets are reliable, UDP sockets are fast',
        'Used in network programming'
    ],
    examples: [
        'Example: Chat application using sockets',
        'Example: Client-server communication using TCP socket'
    ],
    difficulty: 'Medium',
    tags: ['socket', 'network', 'programming'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Socket Programming',
    content: `Socket programming is a method used to establish communication between two devices over a network using sockets.

Concept:
- Socket = endpoint for communication
- Identified by IP address + Port number

Types:
- TCP Socket → Reliable communication
- UDP Socket → Fast but unreliable

Steps:
1. Create socket
2. Bind to address
3. Listen (server)
4. Accept connection
5. Send/receive data

Used in:
- Client-server applications`,
    keyPoints: [
        'Enables communication between devices',
        'Uses IP and port for identification',
        'TCP sockets are reliable, UDP sockets are fast',
        'Used in network programming'
    ],
    examples: [
        'Example: Chat application using sockets',
        'Example: Client-server communication using TCP socket'
    ],
    difficulty: 'Medium',
    tags: ['socket', 'network', 'programming'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'QoS (Quality of Service)',
    content: `QoS refers to techniques used to manage network resources and ensure reliable performance for specific types of traffic.

Parameters:
- Bandwidth → Data transfer rate
- Latency → Delay in transmission
- Jitter → Variation in delay
- Packet Loss → Lost packets

Techniques:
- Traffic shaping
- Priority queuing
- Resource reservation

Purpose:
- Ensure performance for critical applications (video calls, VoIP)`,
    keyPoints: [
        'Ensures reliable network performance',
        'Controls bandwidth and latency',
        'Important for real-time applications',
        'Used in multimedia and VoIP systems'
    ],
    examples: [
        'Example: Video calls prioritized over downloads',
        'Example: VoIP traffic given higher priority'
    ],
    difficulty: 'Medium',
    tags: ['qos', 'network', 'performance'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Proxy Server',
    content: `A proxy server acts as an intermediary between client and server. It forwards client requests to the server and returns responses.

Types:
- Forward Proxy → Client-side proxy
- Reverse Proxy → Server-side proxy

Functions:
- Caching content
- Filtering requests
- Hiding client identity

Benefits:
- Improved performance (caching)
- Security and anonymity`,
    keyPoints: [
        'Acts as middle layer between client and server',
        'Improves performance using caching',
        'Provides anonymity and security',
        'Used in corporate networks'
    ],
    examples: [
        'Example: Company restricts access using proxy server',
        'Example: Cached web pages load faster'
    ],
    difficulty: 'Easy',
    tags: ['proxy', 'network', 'security'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Reverse Proxy',
    content: `A reverse proxy sits in front of servers and forwards client requests to appropriate backend servers.

Working:
- Client sends request to proxy
- Proxy forwards to backend server
- Response returned to client

Uses:
- Load balancing
- Security (hide backend servers)
- SSL termination

Difference:
- Forward proxy → hides client
- Reverse proxy → hides server`,
    keyPoints: [
        'Handles requests on behalf of servers',
        'Improves scalability and security',
        'Used in load balancing setups',
        'Common in web architectures'
    ],
    examples: [
        'Example: Nginx used as reverse proxy',
        'Example: Cloudflare acts as reverse proxy'
    ],
    difficulty: 'Medium',
    tags: ['reverse-proxy', 'network', 'architecture'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'WebSocket',
    content: `WebSocket is a protocol that provides full-duplex communication between client and server over a single persistent connection.

Features:
- Real-time communication
- Low latency
- Persistent connection

Difference from HTTP:
- HTTP is request-response
- WebSocket is continuous connection

Uses:
- Chat applications
- Live notifications
- Online gaming`,
    keyPoints: [
        'Enables real-time communication',
        'Maintains persistent connection',
        'Low latency compared to HTTP',
        'Used in interactive applications'
    ],
    examples: [
        'Example: WhatsApp Web uses WebSocket',
        'Example: Live stock price updates'
    ],
    difficulty: 'Medium',
    tags: ['websocket', 'realtime', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'REST vs gRPC',
    content: `REST and gRPC are communication protocols used for client-server interaction.

REST:
- Uses HTTP
- JSON format
- Simple and widely used

gRPC:
- Uses HTTP/2
- Binary format (Protocol Buffers)
- Faster and efficient

Differences:
- REST is human-readable, gRPC is faster
- gRPC supports streaming
- REST is more flexible

Use Cases:
- REST → Web APIs
- gRPC → Microservices communication`,
    keyPoints: [
        'REST is simple and widely used',
        'gRPC is faster and efficient',
        'gRPC uses binary data',
        'REST uses JSON format'
    ],
    examples: [
        'Example: REST APIs in web applications',
        'Example: gRPC used in microservices architecture'
    ],
    difficulty: 'Medium',
    tags: ['rest', 'grpc', 'api'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'BGP (Border Gateway Protocol)',
    content: `BGP is a path-vector routing protocol used to exchange routing information between different autonomous systems (AS) on the internet.

Working:
- Each AS advertises routes to others
- Uses path attributes to select best route

Features:
- Policy-based routing
- Highly scalable

Importance:
- Backbone of the internet routing

Challenges:
- Complex configuration
- Slow convergence`,
    keyPoints: [
        'Used for inter-domain routing',
        'Operates between autonomous systems',
        'Ensures global internet connectivity',
        'Policy-based routing decisions'
    ],
    examples: [
        'Example: ISPs use BGP to route internet traffic',
        'Example: Google and AWS exchange routes using BGP'
    ],
    difficulty: 'Hard',
    tags: ['bgp', 'routing', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'MPLS (Multi-Protocol Label Switching)',
    content: `MPLS is a technique used to speed up network traffic by directing data based on labels instead of IP addresses.

Working:
- Packets assigned labels
- Routers forward packets based on labels

Advantages:
- Faster forwarding
- Reduced lookup time
- Traffic engineering

Used in:
- Large enterprise networks
- ISPs`,
    keyPoints: [
        'Uses labels instead of IP for routing',
        'Improves speed and efficiency',
        'Supports traffic engineering',
        'Used in high-performance networks'
    ],
    examples: [
        'Example: ISPs use MPLS for faster routing',
        'Example: Enterprise networks optimize traffic using MPLS'
    ],
    difficulty: 'Hard',
    tags: ['mpls', 'network', 'routing'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Rate Limiting',
    content: `Rate limiting controls the number of requests a client can make to a server in a given time period.

Purpose:
- Prevent abuse
- Protect server from overload
- Ensure fair usage

Techniques:
- Token Bucket
- Leaky Bucket
- Fixed Window

Used in:
- APIs
- Web services`,
    keyPoints: [
        'Limits number of requests',
        'Prevents server overload',
        'Ensures fair usage',
        'Used in API security'
    ],
    examples: [
        'Example: API allows 100 requests per minute',
        'Example: Too many requests → blocked temporarily'
    ],
    difficulty: 'Medium',
    tags: ['rate-limiting', 'network', 'api'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Zero Trust Security',
    content: `Zero Trust is a security model that assumes no user or device is trusted by default, even inside the network.

Principles:
- Verify every request
- Least privilege access
- Continuous monitoring

Components:
- Authentication
- Authorization
- Encryption

Purpose:
- Improve security in modern distributed systems`,
    keyPoints: [
        'No implicit trust in network',
        'Every request must be verified',
        'Improves security posture',
        'Used in modern cloud systems'
    ],
    examples: [
        'Example: Access requires authentication every time',
        'Example: Corporate systems use zero trust model'
    ],
    difficulty: 'Medium',
    tags: ['security', 'zero-trust', 'network'],
    sourceAttribution: 'Internal'
},
{
    subject: 'CN',
    title: 'Zero Trust Security',
    content: `Zero Trust is a security model that assumes no user or device is trusted by default, even inside the network.

Principles:
- Verify every request
- Least privilege access
- Continuous monitoring

Components:
- Authentication
- Authorization
- Encryption

Purpose:
- Improve security in modern distributed systems`,
    keyPoints: [
        'No implicit trust in network',
        'Every request must be verified',
        'Improves security posture',
        'Used in modern cloud systems'
    ],
    examples: [
        'Example: Access requires authentication every time',
        'Example: Corporate systems use zero trust model'
    ],
    difficulty: 'Medium',
    tags: ['security', 'zero-trust', 'network'],
    sourceAttribution: 'Internal'
},
    // DBMS topics
    {
    subject: 'DBMS',
    title: 'DBMS vs RDBMS',
    content: `DBMS (Database Management System) is software that allows users to store, retrieve, and manage data. RDBMS (Relational Database Management System) is a type of DBMS that stores data in structured tables with relationships.

DBMS:
- Data stored as files
- No strict relationships
- Less secure
- Examples: File systems

RDBMS:
- Data stored in tables (rows & columns)
- Relationships using keys
- Supports constraints and normalization
- Examples: MySQL, PostgreSQL

Key Difference:
- DBMS is general, RDBMS is relational and structured`,
    keyPoints: [
        'DBMS stores data without strict relationships',
        'RDBMS uses tables and relations',
        'RDBMS supports constraints and normalization',
        'RDBMS is more secure and scalable'
    ],
    examples: [
        'Example: Excel sheet behaves like DBMS',
        'Example: MySQL uses tables with relationships (RDBMS)'
    ],
    difficulty: 'Easy',
    tags: ['dbms', 'rdbms', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'ER Model',
    content: `The ER model is used to design the structure of a database by representing real-world entities and their relationships.

Components:
- Entity → Object (Student, Employee)
- Attributes → Properties (Name, ID)
- Relationship → Connection between entities

Types of Relationships:
- One-to-One
- One-to-Many
- Many-to-Many

Symbols:
- Rectangle → Entity
- Oval → Attribute
- Diamond → Relationship

Purpose:
- Conceptual database design
- Easy visualization`,
    keyPoints: [
        'Used for database design',
        'Represents entities and relationships',
        'Helps in understanding data structure',
        'Converted into tables in RDBMS'
    ],
    examples: [
        'Example: Student → Enrolls → Course',
        'Example: Employee works in Department'
    ],
    difficulty: 'Easy',
    tags: ['er-model', 'design', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Keys in DBMS',
    content: `Keys are attributes used to uniquely identify records in a table and establish relationships between tables.

Types:
- Primary Key:
  Uniquely identifies each record, cannot be NULL

- Foreign Key:
  Links one table to another

- Candidate Key:
  Possible keys that can be primary key

- Super Key:
  Set of attributes that uniquely identify records

- Composite Key:
  Combination of multiple attributes

Purpose:
- Maintain uniqueness
- Establish relationships`,
    keyPoints: [
        'Primary key uniquely identifies records',
        'Foreign key creates relationships',
        'Candidate keys are potential primary keys',
        'Composite key uses multiple attributes'
    ],
    examples: [
        'Example: Student ID as primary key',
        'Example: CourseID as foreign key in Enrollment table'
    ],
    difficulty: 'Easy',
    tags: ['keys', 'database', 'constraints'],
    sourceAttribution: 'Internal'
},
    {
        subject: 'DBMS',
        title: 'Normalization',
        content: `Normalization is the process of organizing data to reduce redundancy and improve data integrity.

Normal Forms:
- 1NF: Atomic values, no repeating groups
- 2NF: 1NF + no partial dependencies
- 3NF: 2NF + no transitive dependencies
- BCNF: Stricter than 3NF
- 4NF: Handles multivalued dependencies
- 5NF: Handles join dependencies`,
        keyPoints: [
            'Normalization reduces data redundancy',
            'Improves data integrity and consistency',
            'Each normal form has specific requirements',
            'Over-normalization can reduce performance',
            'Denormalization is sometimes used for performance'
        ],
        examples: [
            '1NF violation: Student can have multiple phone numbers in one field',
            '2NF violation: Non-key attribute depends on partial key',
            '3NF violation: Non-key attribute depends on another non-key attribute (transitive dependency)'
        ],
        difficulty: 'Medium',
        tags: ['database', 'normalization', 'design'],
        sourceAttribution: 'Internal'
    },
{
    subject: 'DBMS',
    title: 'Functional Dependency',
    content: `Functional dependency describes the relationship between attributes in a table, where one attribute determines another.

Definition:
- A → B means A determines B

Types:
- Full Dependency:
  Entire key determines attribute

- Partial Dependency:
  Part of key determines attribute

- Transitive Dependency:
  A → B and B → C implies A → C

Importance:
- Used in normalization
- Helps identify redundancy`,
    keyPoints: [
        'Defines relationship between attributes',
        'Used in normalization process',
        'Helps detect redundancy',
        'Important for database design'
    ],
    examples: [
        'Example: StudentID → Name',
        'Example: ID → Dept and Dept → Manager (transitive)'
    ],
    difficulty: 'Medium',
    tags: ['functional-dependency', 'database', 'normalization'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Functional Dependency',
    content: `Functional dependency describes the relationship between attributes in a table, where one attribute determines another.

Definition:
- A → B means A determines B

Types:
- Full Dependency:
  Entire key determines attribute

- Partial Dependency:
  Part of key determines attribute

- Transitive Dependency:
  A → B and B → C implies A → C

Importance:
- Used in normalization
- Helps identify redundancy`,
    keyPoints: [
        'Defines relationship between attributes',
        'Used in normalization process',
        'Helps detect redundancy',
        'Important for database design'
    ],
    examples: [
        'Example: StudentID → Name',
        'Example: ID → Dept and Dept → Manager (transitive)'
    ],
    difficulty: 'Medium',
    tags: ['functional-dependency', 'database', 'normalization'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Transactions',
    content: `A transaction is a sequence of database operations (read/write) that are executed as a single logical unit of work.

Properties:
- Must either fully complete or not execute at all

States of Transaction:
- Active → executing
- Partially Committed → last statement executed
- Committed → changes saved
- Failed → error occurred
- Aborted → rolled back

Operations:
- Read(X)
- Write(X)

Purpose:
- Maintain data integrity
- Ensure consistency in database`,
    keyPoints: [
        'Transaction is a logical unit of work',
        'Ensures data consistency and integrity',
        'Either fully executes or rolls back',
        'Has multiple states during execution'
    ],
    examples: [
        'Example: Bank transfer (debit + credit must both succeed)',
        'Example: If one step fails → entire transaction is rolled back'
    ],
    difficulty: 'Medium',
    tags: ['transactions', 'database', 'acid'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'ACID Properties',
    content: `ACID properties ensure reliable execution of transactions in a database.

A → Atomicity:
- All operations complete or none

C → Consistency:
- Database remains in valid state

I → Isolation:
- Transactions do not interfere with each other

D → Durability:
- Once committed, data is permanently stored

Purpose:
- Guarantee correctness of transactions
- Prevent data corruption`,
    keyPoints: [
        'Atomicity ensures all-or-nothing execution',
        'Consistency maintains valid database state',
        'Isolation prevents interference',
        'Durability ensures permanent storage'
    ],
    examples: [
        'Example: Bank transfer must either fully complete or rollback',
        'Example: Committed data remains even after system crash'
    ],
    difficulty: 'Medium',
    tags: ['acid', 'transactions', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Locking (Shared, Exclusive)',
    content: `Locking is a mechanism used to control access to data during concurrent transactions.

Types:
- Shared Lock (S):
  Allows multiple transactions to read data

- Exclusive Lock (X):
  Only one transaction can read/write data

Protocols:
- Two-Phase Locking (2PL):
  Growing phase → acquire locks
  Shrinking phase → release locks

Purpose:
- Prevent conflicts
- Ensure data consistency`,
    keyPoints: [
        'Controls access to shared data',
        'Shared lock allows read only',
        'Exclusive lock allows write',
        '2PL ensures serializability'
    ],
    examples: [
        'Example: Multiple users reading same data → shared lock',
        'Example: One user updating data → exclusive lock'
    ],
    difficulty: 'Medium',
    tags: ['locking', 'concurrency', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Deadlocks in DBMS',
    content: `A deadlock occurs when two or more transactions are waiting indefinitely for each other to release locks.

Conditions:
- Mutual Exclusion
- Hold and Wait
- No Preemption
- Circular Wait

Handling Deadlocks:
- Prevention → avoid conditions
- Detection → detect cycle in wait-for graph
- Recovery → abort transactions

Impact:
- System slowdown
- Resource blocking`,
    keyPoints: [
        'Occurs due to circular waiting for locks',
        'Causes transactions to block indefinitely',
        'Handled using prevention, detection, recovery',
        'Important in concurrency control'
    ],
    examples: [
        'Example: T1 holds A, waits for B; T2 holds B, waits for A',
        'Example: System detects cycle and aborts one transaction'
    ],
    difficulty: 'Hard',
    tags: ['deadlock', 'database', 'transactions'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Indexing',
    content: `Indexing is a technique used to improve the speed of data retrieval operations on a database table.

Types:
- Primary Index → Based on primary key
- Secondary Index → On non-key attributes
- Clustered Index → Data stored in order of index
- Non-Clustered Index → Separate structure pointing to data

Working:
- Similar to index in a book
- Avoids full table scan

Trade-off:
- Faster reads
- Slower writes (index maintenance)`,
    keyPoints: [
        'Improves query performance',
        'Avoids full table scan',
        'Clustered stores data physically',
        'Non-clustered stores pointers'
    ],
    examples: [
        'Example: Searching student by ID using index',
        'Example: Without index → full table scan'
    ],
    difficulty: 'Medium',
    tags: ['indexing', 'performance', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'SQL Commands',
    content: `SQL (Structured Query Language) is used to interact with databases.

Types:
- DDL (Data Definition Language):
  CREATE, ALTER, DROP

- DML (Data Manipulation Language):
  INSERT, UPDATE, DELETE

- DCL (Data Control Language):
  GRANT, REVOKE

- TCL (Transaction Control Language):
  COMMIT, ROLLBACK, SAVEPOINT

Purpose:
- Define, manipulate, and control data`,
    keyPoints: [
        'DDL defines structure',
        'DML manipulates data',
        'DCL controls permissions',
        'TCL manages transactions'
    ],
    examples: [
        'Example: CREATE TABLE students',
        'Example: INSERT INTO students VALUES(...)'
    ],
    difficulty: 'Easy',
    tags: ['sql', 'ddl', 'dml'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Joins',
    content: `Joins are used to combine rows from two or more tables based on a related column.

Types:
- Inner Join → Only matching records
- Left Join → All from left + matching from right
- Right Join → All from right + matching from left
- Full Join → All records from both tables

Purpose:
- Retrieve related data from multiple tables`,
    keyPoints: [
        'Combines data from multiple tables',
        'Inner join returns matching records',
        'Outer joins include unmatched records',
        'Based on foreign key relationships'
    ],
    examples: [
        'Example: Student + Course tables joined on student_id',
        'Example: Left join shows all students even without course'
    ],
    difficulty: 'Medium',
    tags: ['joins', 'sql', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Views',
    content: `A view is a virtual table based on the result of a SQL query. It does not store data physically.

Features:
- Simplifies complex queries
- Provides security (restrict columns)
- Always reflects latest data

Types:
- Simple View
- Complex View

Purpose:
- Abstraction layer for users`,
    keyPoints: [
        'Virtual table based on query',
        'Does not store actual data',
        'Improves security and simplicity',
        'Reflects real-time data'
    ],
    examples: [
        'Example: View showing only student names',
        'Example: Hide sensitive columns using view'
    ],
    difficulty: 'Easy',
    tags: ['views', 'sql', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Triggers',
    content: `A trigger is a procedure that automatically executes when a specific event occurs on a table.

Events:
- INSERT
- UPDATE
- DELETE

Types:
- BEFORE trigger
- AFTER trigger

Purpose:
- Enforce business rules
- Maintain integrity`,
    keyPoints: [
        'Automatically executed on events',
        'Used for validation and logging',
        'Enhances data integrity',
        'Runs before or after operations'
    ],
    examples: [
        'Example: Log entry created after inserting record',
        'Example: Prevent deletion of important data'
    ],
    difficulty: 'Medium',
    tags: ['triggers', 'sql', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Stored Procedures',
    content: `A stored procedure is a precompiled collection of SQL statements stored in the database.

Features:
- Reusable
- Improves performance
- Reduces network traffic

Advantages:
- Faster execution
- Better security
- Modular code`,
    keyPoints: [
        'Precompiled SQL code',
        'Reusable and efficient',
        'Reduces redundancy',
        'Improves performance'
    ],
    examples: [
        'Example: Procedure for salary calculation',
        'Example: Used in complex business logic'
    ],
    difficulty: 'Medium',
    tags: ['stored-procedure', 'sql', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Constraints',
    content: `Constraints are rules applied to columns to enforce data integrity.

Types:
- NOT NULL
- UNIQUE
- PRIMARY KEY
- FOREIGN KEY
- CHECK
- DEFAULT

Purpose:
- Ensure valid data
- Prevent incorrect entries`,
    keyPoints: [
        'Enforces rules on data',
        'Ensures data integrity',
        'Prevents invalid entries',
        'Defined at table level'
    ],
    examples: [
        'Example: Age > 18 using CHECK constraint',
        'Example: UNIQUE email for users'
    ],
    difficulty: 'Easy',
    tags: ['constraints', 'database', 'sql'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Aggregation Functions',
    content: `Aggregation functions perform calculations on multiple rows and return a single value.

Functions:
- COUNT()
- SUM()
- AVG()
- MIN()
- MAX()

Used with:
- GROUP BY
- HAVING`,
    keyPoints: [
        'Performs calculations on data',
        'Returns single value',
        'Used with GROUP BY',
        'Useful for analytics'
    ],
    examples: [
        'Example: COUNT students in class',
        'Example: AVG salary of employees'
    ],
    difficulty: 'Easy',
    tags: ['aggregation', 'sql', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Group By & Having',
    content: `GROUP BY is used to group rows with similar values, while HAVING filters grouped results.

Difference:
- WHERE → filters rows before grouping
- HAVING → filters after grouping

Purpose:
- Perform aggregation on grouped data`,
    keyPoints: [
        'GROUP BY groups data',
        'HAVING filters grouped results',
        'Used with aggregation functions',
        'Different from WHERE clause'
    ],
    examples: [
        'Example: GROUP BY department to count employees',
        'Example: HAVING count > 5'
    ],
    difficulty: 'Medium',
    tags: ['group-by', 'having', 'sql'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'B+ Trees',
    content: `B+ Trees are data structures used for indexing in databases to allow efficient searching, insertion, and deletion.

Features:
- Balanced tree
- All data stored in leaf nodes
- Leaf nodes are linked

Advantages:
- Fast search (log n)
- Efficient range queries

Used in:
- Database indexing
- File systems`,
    keyPoints: [
        'Used for efficient indexing',
        'Balanced tree structure',
        'Supports fast search and range queries',
        'Widely used in DBMS'
    ],
    examples: [
        'Example: Searching records using index',
        'Example: Range queries in database'
    ],
    difficulty: 'Hard',
    tags: ['b+tree', 'indexing', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Query Optimization',
    content: `Query optimization is the process of improving the performance of SQL queries by selecting the most efficient execution plan.

Working:
- DBMS analyzes multiple execution strategies
- Chooses the lowest cost plan

Techniques:
- Index usage
- Join reordering
- Predicate pushdown

Goal:
- Reduce execution time
- Minimize resource usage`,
    keyPoints: [
        'Improves query performance',
        'Uses cost-based optimization',
        'Reduces execution time',
        'Uses indexes and efficient joins'
    ],
    examples: [
        'Example: Using index instead of full table scan',
        'Example: Optimizing join order for faster results'
    ],
    difficulty: 'Hard',
    tags: ['query-optimization', 'performance', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Execution Plan',
    content: `An execution plan is a detailed roadmap that shows how a database will execute a query.

Includes:
- Table scans
- Index usage
- Join methods (nested loop, hash join)

Purpose:
- Analyze query performance
- Identify bottlenecks

Tools:
- EXPLAIN (MySQL, PostgreSQL)

Importance:
- Helps optimize slow queries`,
    keyPoints: [
        'Shows how query is executed',
        'Helps identify performance issues',
        'Includes scan and join strategies',
        'Used for optimization'
    ],
    examples: [
        'Example: EXPLAIN SELECT * FROM table',
        'Example: Detect full table scan in execution plan'
    ],
    difficulty: 'Medium',
    tags: ['execution-plan', 'performance', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Hashing',
    content: `Hashing is a technique used to map data to a fixed-size value (hash key) for fast retrieval.

Types:
- Static Hashing
- Dynamic Hashing (Extendible, Linear)

Working:
- Hash function maps key to bucket

Advantages:
- Fast access (O(1))
- Efficient for equality queries

Disadvantages:
- Not suitable for range queries`,
    keyPoints: [
        'Maps keys to hash values',
        'Provides fast data access',
        'Used in indexing and searching',
        'Not suitable for range queries'
    ],
    examples: [
        'Example: Hash function maps ID to bucket',
        'Example: Fast lookup in hash table'
    ],
    difficulty: 'Medium',
    tags: ['hashing', 'database', 'indexing'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'CAP Theorem',
    content: `CAP theorem states that a distributed database can provide only two out of three guarantees:

C → Consistency:
- All nodes see same data

A → Availability:
- System always responds

P → Partition Tolerance:
- System works despite network failures

Trade-offs:
- CP → Consistency + Partition (no availability)
- AP → Availability + Partition (no strict consistency)

Used in:
- Distributed systems`,
    keyPoints: [
        'Only two of three properties can be achieved',
        'Important in distributed databases',
        'Trade-off between consistency and availability',
        'Partition tolerance is essential'
    ],
    examples: [
        'Example: NoSQL databases prefer availability',
        'Example: Banking systems prefer consistency'
    ],
    difficulty: 'Hard',
    tags: ['cap-theorem', 'distributed', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'NoSQL vs SQL',
    content: `SQL databases are relational and structured, while NoSQL databases are non-relational and flexible.

SQL:
- Structured tables
- Fixed schema
- ACID properties
- Examples: MySQL, PostgreSQL

NoSQL:
- Flexible schema
- Scalable
- Types: Key-Value, Document, Graph
- Examples: MongoDB, Redis

Differences:
- SQL → consistency
- NoSQL → scalability`,
    keyPoints: [
        'SQL uses structured schema',
        'NoSQL is flexible and scalable',
        'SQL follows ACID, NoSQL follows BASE',
        'Used based on application needs'
    ],
    examples: [
        'Example: Banking system uses SQL',
        'Example: Social media uses NoSQL for scalability'
    ],
    difficulty: 'Medium',
    tags: ['nosql', 'sql', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'NoSQL vs SQL',
    content: `SQL databases are relational and structured, while NoSQL databases are non-relational and flexible.

SQL:
- Structured tables
- Fixed schema
- ACID properties
- Examples: MySQL, PostgreSQL

NoSQL:
- Flexible schema
- Scalable
- Types: Key-Value, Document, Graph
- Examples: MongoDB, Redis

Differences:
- SQL → consistency
- NoSQL → scalability`,
    keyPoints: [
        'SQL uses structured schema',
        'NoSQL is flexible and scalable',
        'SQL follows ACID, NoSQL follows BASE',
        'Used based on application needs'
    ],
    examples: [
        'Example: Banking system uses SQL',
        'Example: Social media uses NoSQL for scalability'
    ],
    difficulty: 'Medium',
    tags: ['nosql', 'sql', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Two-Phase Commit (2PC)',
    content: `Two-Phase Commit is a protocol used in distributed databases to ensure all nodes either commit or abort a transaction together.

Phases:
1. Prepare Phase:
   - Coordinator asks all nodes if they can commit

2. Commit Phase:
   - If all agree → commit
   - If any fails → rollback

Purpose:
- Ensure consistency across distributed systems

Problem:
- Blocking issue if coordinator fails`,
    keyPoints: [
        'Used in distributed transactions',
        'Ensures atomicity across nodes',
        'Has prepare and commit phases',
        'Can block if coordinator fails'
    ],
    examples: [
        'Example: Distributed banking transaction across servers',
        'Example: All nodes must commit or rollback together'
    ],
    difficulty: 'Hard',
    tags: ['2pc', 'distributed', 'transactions'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Sharding',
    content: `Sharding is a technique used to horizontally partition data across multiple databases or servers.

Working:
- Data divided into shards based on key (user_id, region)

Benefits:
- Improves scalability
- Distributes load

Challenges:
- Complex queries
- Data consistency

Used in:
- Large-scale applications`,
    keyPoints: [
        'Splits data across multiple servers',
        'Improves scalability',
        'Reduces load on single database',
        'Complex to manage'
    ],
    examples: [
        'Example: Users divided across servers by region',
        'Example: Each shard handles subset of data'
    ],
    difficulty: 'Medium',
    tags: ['sharding', 'scaling', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Denormalization',
    content: `Denormalization is the process of combining tables or adding redundant data to improve read performance.

Why:
- Reduce joins
- Faster queries

Trade-off:
- Increased redundancy
- Possible inconsistency

Used in:
- Data warehouses
- High-performance systems`,
    keyPoints: [
        'Adds redundancy for performance',
        'Reduces number of joins',
        'Improves read speed',
        'May reduce data consistency'
    ],
    examples: [
        'Example: Storing user name in multiple tables',
        'Example: Avoid joins in large queries'
    ],
    difficulty: 'Medium',
    tags: ['denormalization', 'performance', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Database Partitioning',
    content: `Partitioning divides a large table into smaller pieces (partitions) for better performance and management.

Types:
- Horizontal Partitioning → Rows split
- Vertical Partitioning → Columns split

Benefits:
- Faster queries
- Better manageability

Difference:
- Partitioning → within same DB
- Sharding → across multiple DBs`,
    keyPoints: [
        'Splits large tables into smaller parts',
        'Improves performance',
        'Easier data management',
        'Different from sharding'
    ],
    examples: [
        'Example: Table split by date ranges',
        'Example: Separate columns into different partitions'
    ],
    difficulty: 'Medium',
    tags: ['partitioning', 'database', 'performance'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Database Partitioning',
    content: `Partitioning divides a large table into smaller pieces (partitions) for better performance and management.

Types:
- Horizontal Partitioning → Rows split
- Vertical Partitioning → Columns split

Benefits:
- Faster queries
- Better manageability

Difference:
- Partitioning → within same DB
- Sharding → across multiple DBs`,
    keyPoints: [
        'Splits large tables into smaller parts',
        'Improves performance',
        'Easier data management',
        'Different from sharding'
    ],
    examples: [
        'Example: Table split by date ranges',
        'Example: Separate columns into different partitions'
    ],
    difficulty: 'Medium',
    tags: ['partitioning', 'database', 'performance'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Isolation Levels',
    content: `Isolation levels define how transaction visibility is controlled when multiple transactions execute concurrently.

Levels:
- Read Uncommitted → Can read uncommitted data (dirty reads)
- Read Committed → Only committed data visible
- Repeatable Read → Same data returned in transaction
- Serializable → Fully isolated (like sequential execution)

Purpose:
- Balance between consistency and performance`,
    keyPoints: [
        'Controls visibility of data between transactions',
        'Higher isolation = more consistency, less performance',
        'Prevents anomalies like dirty reads',
        'Serializable is strongest level'
    ],
    examples: [
        'Example: Dirty read occurs in read uncommitted',
        'Example: Banking systems use higher isolation levels'
    ],
    difficulty: 'Hard',
    tags: ['isolation', 'transactions', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Write-Ahead Logging (WAL)',
    content: `WAL is a technique where changes are first written to a log before being applied to the database.

Working:
- Log entry written before actual data change
- Ensures recovery in case of crash

Purpose:
- Maintain durability
- Enable crash recovery

Used in:
- PostgreSQL, MySQL (InnoDB)`,
    keyPoints: [
        'Logs changes before applying them',
        'Ensures durability',
        'Helps in crash recovery',
        'Used in modern databases'
    ],
    examples: [
        'Example: Log stores transaction before update',
        'Example: System recovers using log after crash'
    ],
    difficulty: 'Hard',
    tags: ['wal', 'logging', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'OLTP vs OLAP',
    content: `OLTP and OLAP are two types of database systems based on usage.

OLTP (Online Transaction Processing):
- Handles day-to-day transactions
- Fast inserts/updates
- Example: Banking systems

OLAP (Online Analytical Processing):
- Used for analysis and reporting
- Complex queries
- Example: Data warehouse

Difference:
- OLTP → operations
- OLAP → analytics`,
    keyPoints: [
        'OLTP handles real-time transactions',
        'OLAP handles analytical queries',
        'OLTP is fast and frequent',
        'OLAP is complex and data-heavy'
    ],
    examples: [
        'Example: ATM transaction → OLTP',
        'Example: Sales report analysis → OLAP'
    ],
    difficulty: 'Easy',
    tags: ['oltp', 'olap', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Transactions',
    content: `A transaction is a sequence of one or more database operations (read/write) executed as a single logical unit of work. It ensures that the database moves from one consistent state to another.

Core Idea:
- Either all operations of a transaction are successfully executed OR none are (all-or-nothing principle).

Example flow:
1. Begin Transaction
2. Perform operations (Read/Write)
3. Commit (save changes) OR Rollback (undo changes)

Transaction States:
- Active → Transaction is executing
- Partially Committed → Last statement executed
- Committed → Changes permanently saved
- Failed → Error occurs
- Aborted → Transaction rolled back

Operations:
- Read(X): Reads value of X from database
- Write(X): Updates value of X in database

Purpose:
- Maintain data integrity
- Ensure consistency even in failures or concurrent execution

ACID Link:
Transactions follow ACID properties:
- Atomicity → All or nothing
- Consistency → Valid state maintained
- Isolation → Independent execution
- Durability → Permanent storage after commit`,
    
    keyPoints: [
        'Transaction is a logical unit of work',
        'Follows all-or-nothing principle',
        'Ensures data consistency and integrity',
        'Uses commit and rollback mechanisms',
        'Has multiple execution states'
    ],
    
    examples: [
        'Example 1: Bank Transfer\nDebit from A and credit to B must both succeed, otherwise rollback',
        'Example 2: Online Order\nPayment + order creation must both complete or fail together'
    ],
    
    difficulty: 'Medium',
    tags: ['transactions', 'acid', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Transaction States',
    content: `A transaction goes through multiple states during its lifecycle.

States:
- Active:
  Transaction is executing operations

- Partially Committed:
  Last statement executed but not yet committed

- Committed:
  All changes successfully saved

- Failed:
  Error occurred during execution

- Aborted:
  Transaction rolled back and database restored

- Terminated:
  Transaction completes and resources are released

Flow:
Active → Partially Committed → Committed
           ↓
         Failed → Aborted → Terminated`,
    
    keyPoints: [
        'Transaction passes through multiple states',
        'Failure leads to rollback',
        'Commit makes changes permanent',
        'Helps understand transaction lifecycle'
    ],
    
    examples: [
        'Example: Error during update → transaction moves to failed state',
        'Example: Successful execution → committed state'
    ],
    
    difficulty: 'Medium',
    tags: ['transactions', 'states', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Transaction States',
    content: `A transaction goes through multiple states during its lifecycle.

States:
- Active:
  Transaction is executing operations

- Partially Committed:
  Last statement executed but not yet committed

- Committed:
  All changes successfully saved

- Failed:
  Error occurred during execution

- Aborted:
  Transaction rolled back and database restored

- Terminated:
  Transaction completes and resources are released

Flow:
Active → Partially Committed → Committed
           ↓
         Failed → Aborted → Terminated`,
    
    keyPoints: [
        'Transaction passes through multiple states',
        'Failure leads to rollback',
        'Commit makes changes permanent',
        'Helps understand transaction lifecycle'
    ],
    
    examples: [
        'Example: Error during update → transaction moves to failed state',
        'Example: Successful execution → committed state'
    ],
    
    difficulty: 'Medium',
    tags: ['transactions', 'states', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Serializability',
    content: `Serializability ensures that concurrent transactions produce the same result as if they were executed sequentially (one after another).

Types:
- Conflict Serializability:
  Based on conflicting operations (read/write)

- View Serializability:
  Based on final result equivalence

Why important:
- Ensures correctness in concurrent execution

Key idea:
- Even if transactions run in parallel, result must be same as serial execution`,
    
    keyPoints: [
        'Ensures correctness of concurrent transactions',
        'Equivalent to serial execution',
        'Prevents inconsistency',
        'Important for concurrency control'
    ],
    
    examples: [
        'Example: T1 and T2 execute concurrently but result matches serial order',
        'Example: Schedule rearranged without changing outcome'
    ],
    
    difficulty: 'Hard',
    tags: ['serializability', 'concurrency', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Recoverability',
    content: `Recoverability ensures that a transaction commits only after all transactions whose data it depends on have committed.

Types:
- Recoverable Schedule:
  T2 commits only after T1 (if T2 depends on T1)

- Cascading Rollback:
  If T1 fails, dependent transactions also rollback

- Cascadeless Schedule:
  Prevents cascading rollback by reading only committed data

Purpose:
- Maintain consistency after failures`,
    
    keyPoints: [
        'Ensures safe commit order',
        'Prevents invalid data dependencies',
        'Avoids cascading rollbacks',
        'Important for recovery'
    ],
    
    examples: [
        'Example: T2 reads from T1 → T2 must commit after T1',
        'Example: If T1 fails, T2 must rollback'
    ],
    
    difficulty: 'Hard',
    tags: ['recoverability', 'transactions', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Cascading Rollback',
    content: `Cascading rollback occurs when a transaction failure causes other dependent transactions to also rollback.

Cause:
- Transactions reading uncommitted data

Problem:
- Multiple rollbacks
- Performance degradation

Solution:
- Use cascadeless schedules
- Enforce strict isolation`,
    
    keyPoints: [
        'Occurs due to dependency on uncommitted data',
        'Leads to multiple rollbacks',
        'Reduces performance',
        'Avoided using strict schedules'
    ],
    
    examples: [
        'Example: T2 reads from T1, T1 fails → T2 must rollback',
        'Example: Chain reaction of rollbacks'
    ],
    
    difficulty: 'Medium',
    tags: ['rollback', 'transactions', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Strict & Rigorous Schedules',
    content: `These are types of schedules that control how transactions access data to ensure consistency.

Strict Schedule:
- Transaction can read/write data only after previous transaction commits

Rigorous Schedule:
- Even stricter: No read or write until commit

Benefits:
- Prevent cascading rollback
- Simplify recovery

Importance:
- Used in real-world DB systems`,
    
    keyPoints: [
        'Ensures safe transaction execution',
        'Prevents cascading rollback',
        'Simplifies recovery process',
        'Used in strict concurrency control'
    ],
    
    examples: [
        'Example: T2 cannot read data until T1 commits',
        'Example: Prevents dirty reads'
    ],
    
    difficulty: 'Hard',
    tags: ['schedule', 'transactions', 'database'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Dirty Read',
    content: `A dirty read occurs when a transaction reads data that has been modified by another transaction but not yet committed.

Problem:
- If the first transaction rolls back, the second transaction has read invalid data

Cause:
- Lack of proper isolation

Impact:
- Data inconsistency and incorrect results`,
    
    keyPoints: [
        'Reads uncommitted data',
        'Leads to inconsistency',
        'Caused by low isolation levels',
        'Avoided using proper isolation'
    ],
    
    examples: [
        'Example: T1 updates balance → T2 reads it → T1 rolls back → T2 has wrong data',
        'Example: Reading temporary/uncommitted values'
    ],
    
    difficulty: 'Medium',
    tags: ['dirty-read', 'transactions', 'concurrency'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Lost Update',
    content: `Lost update occurs when two transactions update the same data and one update overwrites the other.

Cause:
- Concurrent updates without synchronization

Impact:
- One transaction's result is lost

Solution:
- Use locking or isolation mechanisms`,
    
    keyPoints: [
        'Occurs due to concurrent updates',
        'One update overwrites another',
        'Leads to incorrect data',
        'Prevented using locks'
    ],
    
    examples: [
        'Example: T1 and T2 read same value, both update → one update lost',
        'Example: Bank balance updated incorrectly'
    ],
    
    difficulty: 'Medium',
    tags: ['lost-update', 'transactions', 'concurrency'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Unrepeatable Read',
    content: `An unrepeatable read occurs when a transaction reads the same data twice and gets different values due to another committed transaction modifying it.

Cause:
- Concurrent modification of data

Impact:
- Inconsistent results within same transaction`,
    
    keyPoints: [
        'Same query returns different results',
        'Occurs due to concurrent updates',
        'Affects consistency',
        'Controlled by isolation levels'
    ],
    
    examples: [
        'Example: T1 reads value → T2 updates and commits → T1 reads again → different value',
        'Example: Data changes during transaction'
    ],
    
    difficulty: 'Medium',
    tags: ['unrepeatable-read', 'transactions'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Phantom Read',
    content: `A phantom read occurs when a transaction re-executes a query and finds new rows inserted by another transaction.

Cause:
- Concurrent insert/delete operations

Impact:
- Different number of rows returned`,
    
    keyPoints: [
        'New rows appear during transaction',
        'Occurs due to inserts/deletes',
        'Affects query results',
        'Prevented by serializable isolation'
    ],
    
    examples: [
        'Example: T1 queries employees → T2 inserts new employee → T1 queries again → extra row appears',
        'Example: Count changes during transaction'
    ],
    
    difficulty: 'Medium',
    tags: ['phantom-read', 'transactions'],
    sourceAttribution: 'Internal'
},
{
    subject: 'DBMS',
    title: 'Write Skew',
    content: `Write skew occurs when two transactions read overlapping data and update different parts of it, leading to constraint violation.

Cause:
- Lack of proper isolation (especially in snapshot isolation)

Impact:
- Violates business rules without direct conflict

Important:
- Not prevented by simple locking`,
    
    keyPoints: [
        'Occurs in concurrent transactions',
        'Violates constraints indirectly',
        'Common in snapshot isolation',
        'Hard to detect'
    ],
    
    examples: [
        'Example: Two doctors on duty both go off-duty based on stale data',
        'Example: Constraint violated due to concurrent updates'
    ],
    
    difficulty: 'Hard',
    tags: ['write-skew', 'transactions'],
    sourceAttribution: 'Internal'
},
    // System Design topics
    {
        subject: 'System Design',
        title: 'Scalability',
        content: `Scalability is the ability of a system to handle increased load.

Types:
- Vertical Scaling: Adding more power to existing machine
- Horizontal Scaling: Adding more machines

Techniques:
- Load Balancing: Distributing requests across servers
- Caching: Storing frequently accessed data
- Database Replication: Copying data across servers
- Sharding: Partitioning data across multiple databases`,
        keyPoints: [
            'Vertical scaling has hardware limits',
            'Horizontal scaling provides infinite scalability',
            'Load balancing distributes traffic',
            'Caching reduces database load',
            'Database replication ensures reliability'
        ],
        examples: [
            'Netflix uses horizontal scaling with thousands of servers',
            'CDNs like CloudFlare cache content at multiple geographic locations'
        ],
        difficulty: 'Hard',
        tags: ['system-design', 'scalability', 'architecture'],
        sourceAttribution: 'Internal'
    },
    // OOPS topics
    {
    subject: 'OOPS',
    title: 'Class',
    content: `A class is a blueprint or template used to create objects. It defines the structure (attributes/data members) and behavior (methods/functions) that the objects created from it will have.

Key ideas:
- It does not occupy memory until objects are created
- It groups related data and functions together
- Helps achieve modularity and reusability

In real-world terms:
- Class = Design
- Object = Actual entity

Classes support encapsulation by bundling data and methods together.

Syntax concept:
class ClassName {
    data members
    member functions
}`,
    
    keyPoints: [
        'Class is a blueprint for objects',
        'Defines properties and behaviors',
        'Does not occupy memory until object is created',
        'Supports modular and reusable code'
    ],
    
    examples: [
        'Example: Class Car → attributes: color, speed; methods: drive(), brake()',
        'Example: Class Student → name, rollNo, methods like display()'
    ],
    
    difficulty: 'Easy',
    tags: ['class', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Object',
    content: `An object is an instance of a class. It represents a real-world entity and contains actual values for the properties defined in the class.

Key ideas:
- Occupies memory
- Has state (data) and behavior (methods)
- Multiple objects can be created from one class

Structure:
- State → attributes
- Behavior → methods
- Identity → unique reference

Objects interact with each other by calling methods.

In real-world:
- Class = Car
- Object = BMW, Audi`,
    
    keyPoints: [
        'Object is instance of class',
        'Contains actual data',
        'Has state and behavior',
        'Multiple objects can be created from one class'
    ],
    
    examples: [
        'Example: car1.color = "red", car2.color = "blue"',
        'Example: student1 and student2 are different objects of same class'
    ],
    
    difficulty: 'Easy',
    tags: ['object', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Encapsulation',
    content: `Encapsulation is the concept of wrapping data (variables) and methods (functions) together into a single unit (class) and restricting direct access to some of the data.

Key ideas:
- Data hiding using access modifiers (private, protected)
- Access through public methods (getters/setters)
- Protects data from unauthorized access

Why needed:
- Improves security
- Maintains data integrity
- Controls modification

Mechanism:
- Private variables + public methods

Real-world analogy:
- Capsule → everything inside is protected`,
    
    keyPoints: [
        'Bundles data and methods together',
        'Provides data hiding',
        'Uses access modifiers',
        'Improves security and control'
    ],
    
    examples: [
        'Example: Bank account → balance is private, accessed via deposit()/withdraw()',
        'Example: User password stored privately'
    ],
    
    difficulty: 'Medium',
    tags: ['encapsulation', 'data-hiding'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Abstraction',
    content: `Abstraction is the concept of hiding implementation details and showing only essential features to the user.

Key ideas:
- Focus on "what" not "how"
- Achieved using abstract classes and interfaces
- Reduces complexity

Why needed:
- Simplifies code usage
- Improves maintainability
- Enhances security

Mechanism:
- Abstract classes (partial abstraction)
- Interfaces (full abstraction)

Real-world analogy:
- Car → user drives without knowing engine details`,
    
    keyPoints: [
        'Hides internal implementation',
        'Shows only essential features',
        'Reduces complexity',
        'Achieved using abstract classes/interfaces'
    ],
    
    examples: [
        'Example: ATM → user interacts without knowing backend logic',
        'Example: Car driving without engine knowledge'
    ],
    
    difficulty: 'Medium',
    tags: ['abstraction', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Inheritance',
    content: `Inheritance is a mechanism where one class (child/derived) acquires properties and behavior of another class (parent/base).

Types:
- Single
- Multiple
- Multilevel
- Hierarchical
- Hybrid

Key ideas:
- Code reuse
- Extensibility
- Hierarchical relationships

Advantages:
- Reduces redundancy
- Improves maintainability

Real-world:
- Parent → Animal
- Child → Dog`,
    
    keyPoints: [
        'Allows code reuse',
        'Child class inherits parent properties',
        'Supports hierarchical structure',
        'Improves maintainability'
    ],
    
    examples: [
        'Example: Dog inherits from Animal',
        'Example: Student inherits from Person class'
    ],
    
    difficulty: 'Easy',
    tags: ['inheritance', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Polymorphism',
    content: `Polymorphism means "many forms". It allows a single function or method to behave differently depending on the context.

Types:
- Compile-time (Static):
  Method overloading

- Runtime (Dynamic):
  Method overriding

Key ideas:
- Same interface, different behavior
- Improves flexibility and reusability

Why needed:
- Reduces code complexity
- Makes code extensible

Real-world:
- Same function name, different implementations`,
    
    keyPoints: [
        'One interface, multiple behaviors',
        'Supports overloading and overriding',
        'Improves flexibility',
        'Reduces code duplication'
    ],
    
    examples: [
        'Example: add(int, int) vs add(float, float)',
        'Example: draw() behaves differently for shapes'
    ],
    
    difficulty: 'Medium',
    tags: ['polymorphism', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Method Overloading',
    content: `Method overloading is a feature where multiple methods in the same class have the same name but different parameters (type, number, or order).

Key ideas:
- Achieved at compile time (static polymorphism)
- Improves code readability and flexibility
- Return type alone cannot differentiate methods

Rules:
- Different number of parameters OR
- Different data types of parameters

Purpose:
- Perform similar operations with different inputs`,
    
    keyPoints: [
        'Same method name with different parameters',
        'Compile-time polymorphism',
        'Improves readability',
        'Cannot differ only by return type'
    ],
    
    examples: [
        'Example: add(int a, int b) and add(float a, float b)',
        'Example: print(int) and print(String)'
    ],
    
    difficulty: 'Easy',
    tags: ['overloading', 'polymorphism'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Method Overriding',
    content: `Method overriding occurs when a child class provides a specific implementation of a method that is already defined in its parent class.

Key ideas:
- Achieved at runtime (dynamic polymorphism)
- Requires inheritance
- Method signature must be same

Rules:
- Same method name and parameters
- Return type must be same or covariant

Purpose:
- Customize behavior of parent class`,
    
    keyPoints: [
        'Same method in parent and child class',
        'Runtime polymorphism',
        'Requires inheritance',
        'Allows behavior customization'
    ],
    
    examples: [
        'Example: Animal → sound(), Dog overrides sound()',
        'Example: Parent display() overridden in child'
    ],
    
    difficulty: 'Medium',
    tags: ['overriding', 'polymorphism'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Constructor',
    content: `A constructor is a special method used to initialize objects. It is automatically called when an object is created.

Key features:
- Same name as class
- No return type
- Called automatically

Types:
- Default Constructor
- Parameterized Constructor
- Copy Constructor

Purpose:
- Initialize object state
- Allocate resources`,
    
    keyPoints: [
        'Special method for initialization',
        'Called automatically on object creation',
        'No return type',
        'Can be overloaded'
    ],
    
    examples: [
        'Example: Student(name, age) initializes object',
        'Example: Default constructor assigns default values'
    ],
    
    difficulty: 'Easy',
    tags: ['constructor', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Destructor',
    content: `A destructor is a special method used to release resources when an object is destroyed.

Key features:
- Called automatically when object goes out of scope
- Used for cleanup
- Opposite of constructor

Purpose:
- Free memory
- Close files or connections

Note:
- Languages like Java use garbage collection instead`,
    
    keyPoints: [
        'Used to clean up resources',
        'Called automatically',
        'Opposite of constructor',
        'Important in memory management'
    ],
    
    examples: [
        'Example: Closing file when object destroyed',
        'Example: Freeing allocated memory in C++'
    ],
    
    difficulty: 'Easy',
    tags: ['destructor', 'memory'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Access Modifiers',
    content: `Access modifiers define the visibility and accessibility of class members (variables and methods).

Types:
- Public:
  Accessible from anywhere

- Private:
  Accessible only within same class

- Protected:
  Accessible within class and subclasses

Purpose:
- Control access
- Provide security
- Support encapsulation`,
    
    keyPoints: [
        'Controls visibility of members',
        'Public is fully accessible',
        'Private is restricted',
        'Protected allows inheritance access'
    ],
    
    examples: [
        'Example: Private balance in bank class',
        'Example: Protected method accessed in child class'
    ],
    
    difficulty: 'Easy',
    tags: ['access-modifiers', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Data Hiding',
    content: `Data hiding is the practice of restricting direct access to data and allowing access only through controlled methods.

Key ideas:
- Achieved using private variables
- Access via getters and setters
- Part of encapsulation

Purpose:
- Protect data from misuse
- Maintain integrity

Difference:
- Encapsulation = wrapping
- Data hiding = restricting access`,
    
    keyPoints: [
        'Restricts direct access to data',
        'Uses private variables',
        'Access via methods',
        'Improves security'
    ],
    
    examples: [
        'Example: balance is private, accessed via getBalance()',
        'Example: Password stored privately'
    ],
    
    difficulty: 'Medium',
    tags: ['data-hiding', 'encapsulation'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Dynamic Binding',
    content: `Dynamic binding means that the method call is resolved at runtime rather than compile time.

Key ideas:
- Used in method overriding
- Decision made during execution
- Enables runtime polymorphism

Purpose:
- Flexibility
- Dynamic behavior

Example mechanism:
- Parent reference pointing to child object`,
    
    keyPoints: [
        'Binding happens at runtime',
        'Used in method overriding',
        'Supports dynamic polymorphism',
        'Improves flexibility'
    ],
    
    examples: [
        'Example: Animal a = new Dog(); a.sound() calls Dog method',
        'Example: Runtime decision of method execution'
    ],
    
    difficulty: 'Medium',
    tags: ['dynamic-binding', 'polymorphism'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Dynamic Binding',
    content: `Dynamic binding means that the method call is resolved at runtime rather than compile time.

Key ideas:
- Used in method overriding
- Decision made during execution
- Enables runtime polymorphism

Purpose:
- Flexibility
- Dynamic behavior

Example mechanism:
- Parent reference pointing to child object`,
    
    keyPoints: [
        'Binding happens at runtime',
        'Used in method overriding',
        'Supports dynamic polymorphism',
        'Improves flexibility'
    ],
    
    examples: [
        'Example: Animal a = new Dog(); a.sound() calls Dog method',
        'Example: Runtime decision of method execution'
    ],
    
    difficulty: 'Medium',
    tags: ['dynamic-binding', 'polymorphism'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Association',
    content: `Association is a relationship between two classes where objects of one class are connected to objects of another class.

Key ideas:
- Represents "uses-a" relationship
- No ownership between objects
- Can be one-to-one, one-to-many, many-to-many

Types:
- One-to-One
- One-to-Many
- Many-to-Many

Purpose:
- Model real-world relationships between objects`,
    
    keyPoints: [
        'Represents relationship between classes',
        'No ownership between objects',
        'Can have different cardinalities',
        'Basic building block of object relationships'
    ],
    
    examples: [
        'Example: Teacher teaches Student',
        'Example: Customer places Order'
    ],
    
    difficulty: 'Easy',
    tags: ['association', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Aggregation',
    content: `Aggregation is a special type of association that represents a "has-a" relationship where one class contains another class, but both can exist independently.

Key ideas:
- Weak relationship
- Child object can exist without parent
- Represents whole-part relationship

Difference:
- Aggregation = weak ownership

Purpose:
- Reusability and modular design`,
    
    keyPoints: [
        'Represents has-a relationship',
        'Weak ownership',
        'Child can exist independently',
        'Enhances modularity'
    ],
    
    examples: [
        'Example: Department has Employees (employees can exist without department)',
        'Example: Library has Books'
    ],
    
    difficulty: 'Medium',
    tags: ['aggregation', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Composition',
    content: `Composition is a strong form of aggregation where one object fully owns another, and the child object cannot exist independently.

Key ideas:
- Strong relationship
- Child depends on parent
- Lifecycle tied together

Difference:
- Composition = strong ownership

Purpose:
- Build tightly coupled objects with clear ownership`,
    
    keyPoints: [
        'Strong has-a relationship',
        'Child cannot exist without parent',
        'Lifecycle dependency',
        'Ensures strong ownership'
    ],
    
    examples: [
        'Example: House has Rooms (rooms cannot exist without house)',
        'Example: Car has Engine'
    ],
    
    difficulty: 'Medium',
    tags: ['composition', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Composition',
    content: `Composition is a strong form of aggregation where one object fully owns another, and the child object cannot exist independently.

Key ideas:
- Strong relationship
- Child depends on parent
- Lifecycle tied together

Difference:
- Composition = strong ownership

Purpose:
- Build tightly coupled objects with clear ownership`,
    
    keyPoints: [
        'Strong has-a relationship',
        'Child cannot exist without parent',
        'Lifecycle dependency',
        'Ensures strong ownership'
    ],
    
    examples: [
        'Example: House has Rooms (rooms cannot exist without house)',
        'Example: Car has Engine'
    ],
    
    difficulty: 'Medium',
    tags: ['composition', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Cohesion',
    content: `Cohesion refers to how closely related the functions within a single class or module are.

Types:
- High Cohesion:
  All functions are related and focused

- Low Cohesion:
  Unrelated functionalities in one class

Goal:
- Achieve high cohesion

Impact:
- High cohesion → better readability and maintainability`,
    
    keyPoints: [
        'Measures internal relatedness of class',
        'High cohesion is desirable',
        'Improves readability',
        'Enhances maintainability'
    ],
    
    examples: [
        'Example: Class handling only user authentication → high cohesion',
        'Example: Class doing multiple unrelated tasks → low cohesion'
    ],
    
    difficulty: 'Medium',
    tags: ['cohesion', 'design'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Interface',
    content: `An interface is a collection of abstract methods that a class must implement. It provides full abstraction.

Key ideas:
- Only method declarations (no implementation)
- Supports multiple inheritance
- Defines contract for classes

Purpose:
- Achieve abstraction
- Enable loose coupling

Important:
- A class implements an interface`,
    
    keyPoints: [
        'Provides full abstraction',
        'Contains only method declarations',
        'Supports multiple inheritance',
        'Defines contract for classes'
    ],
    
    examples: [
        'Example: Payment interface → implemented by CreditCard, UPI',
        'Example: Shape interface with draw() method'
    ],
    
    difficulty: 'Medium',
    tags: ['interface', 'abstraction'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Abstract Class',
    content: `An abstract class is a class that cannot be instantiated and may contain both abstract and concrete methods.

Key ideas:
- Partial abstraction
- Can have implemented methods
- Used as base class

Difference from interface:
- Interface → full abstraction
- Abstract class → partial abstraction

Purpose:
- Provide common functionality`,
    
    keyPoints: [
        'Cannot create objects',
        'Contains abstract and concrete methods',
        'Supports partial abstraction',
        'Used for inheritance'
    ],
    
    examples: [
        'Example: Animal class with abstract sound()',
        'Example: Shape class with abstract draw()'
    ],
    
    difficulty: 'Medium',
    tags: ['abstract-class', 'abstraction'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Virtual Function',
    content: `A virtual function is a member function that is declared in a base class and overridden in a derived class to achieve runtime polymorphism.

Key ideas:
- Supports dynamic binding
- Called based on object type, not reference

Purpose:
- Enable method overriding

Used in:
- C++ for runtime polymorphism`,
    
    keyPoints: [
        'Supports runtime polymorphism',
        'Uses dynamic binding',
        'Defined in base class',
        'Overridden in derived class'
    ],
    
    examples: [
        'Example: Base class pointer calling child class method',
        'Example: Shape pointer calling draw() of Circle'
    ],
    
    difficulty: 'Medium',
    tags: ['virtual-function', 'polymorphism'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Pure Virtual Function',
    content: `A pure virtual function is a function declared in a base class with no implementation and must be overridden by derived classes.

Key ideas:
- Defined using = 0 (in C++)
- Makes class abstract
- Forces implementation in child class

Purpose:
- Enforce specific behavior in derived classes`,
    
    keyPoints: [
        'No implementation in base class',
        'Must be overridden',
        'Makes class abstract',
        'Used for strict abstraction'
    ],
    
    examples: [
        'Example: virtual void draw() = 0;',
        'Example: Derived classes must implement draw()'
    ],
    
    difficulty: 'Medium',
    tags: ['pure-virtual', 'abstraction'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'SOLID Principles',
    content: `SOLID is a set of 5 design principles used to create maintainable, scalable, and flexible software systems.

Principles:
- S → Single Responsibility:
  A class should have only one reason to change

- O → Open/Closed:
  Open for extension, closed for modification

- L → Liskov Substitution:
  Child class should replace parent without issues

- I → Interface Segregation:
  Many small interfaces instead of one large

- D → Dependency Inversion:
  Depend on abstractions, not concrete classes

Purpose:
- Improve code quality
- Reduce bugs
- Make systems scalable`,
    
    keyPoints: [
        'Five principles for good design',
        'Improves maintainability and scalability',
        'Reduces code complexity',
        'Encourages modular design'
    ],
    
    examples: [
        'Example: Separate login and payment into different classes (SRP)',
        'Example: Use interface instead of concrete class (DIP)'
    ],
    
    difficulty: 'Hard',
    tags: ['solid', 'design'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Dependency Injection',
    content: `Dependency Injection (DI) is a design pattern where an object receives its dependencies from outside rather than creating them internally.

Key ideas:
- Promotes loose coupling
- Improves testability
- Follows Dependency Inversion Principle

Types:
- Constructor Injection
- Setter Injection
- Interface Injection

Purpose:
- Decouple components
- Improve flexibility`,
    
    keyPoints: [
        'Dependencies provided externally',
        'Reduces tight coupling',
        'Improves testability',
        'Supports flexible design'
    ],
    
    examples: [
        'Example: Passing database service into class instead of creating it',
        'Example: Injecting API service into controller'
    ],
    
    difficulty: 'Hard',
    tags: ['dependency-injection', 'design'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Design Patterns',
    content: `Design patterns are reusable solutions to common software design problems.

Types:

1. Singleton:
- Only one instance of class exists
- Global access point

2. Factory:
- Creates objects without specifying exact class
- Encapsulates object creation

3. Observer:
- One-to-many relationship
- When one object changes, others are notified

Purpose:
- Reuse best practices
- Solve common design problems`,
    
    keyPoints: [
        'Reusable solutions to design problems',
        'Improve code structure',
        'Reduce redundancy',
        'Widely used in real-world applications'
    ],
    
    examples: [
        'Example: Singleton → Logger instance',
        'Example: Factory → Creating shapes dynamically',
        'Example: Observer → Notification system'
    ],
    
    difficulty: 'Hard',
    tags: ['design-patterns', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Object Cloning',
    content: `Object cloning is the process of creating an exact copy of an existing object.

Key ideas:
- Copies object state
- Avoids manual duplication

Methods:
- Shallow Copy
- Deep Copy

Purpose:
- Efficient duplication
- Faster object creation`,
    
    keyPoints: [
        'Creates copy of object',
        'Avoids manual object creation',
        'Used in performance optimization',
        'Supports cloning mechanisms'
    ],
    
    examples: [
        'Example: Copying configuration object',
        'Example: Duplicate user object with same data'
    ],
    
    difficulty: 'Medium',
    tags: ['cloning', 'oops'],
    sourceAttribution: 'Internal'
},
{
    subject: 'OOPS',
    title: 'Deep Copy vs Shallow Copy',
    content: `Deep copy and shallow copy are techniques used to duplicate objects.

Shallow Copy:
- Copies references of objects
- Changes affect original object

Deep Copy:
- Copies actual data
- Independent copy

Difference:
- Shallow → shared memory
- Deep → separate memory

Use case:
- Deep copy preferred when independence required`,
    
    keyPoints: [
        'Shallow copy copies references',
        'Deep copy copies actual data',
        'Deep copy is independent',
        'Important for object cloning'
    ],
    
    examples: [
        'Example: Shallow copy modifies original object',
        'Example: Deep copy keeps objects independent'
    ],
    
    difficulty: 'Medium',
    tags: ['deep-copy', 'shallow-copy'],
    sourceAttribution: 'Internal'
},{
    subject: 'OOPS',
    title: 'Method Resolution Order (MRO)',
    content: `MRO defines the order in which methods are searched in a class hierarchy, especially in multiple inheritance.

Key ideas:
- Determines method execution order
- Avoids ambiguity in multiple inheritance

Algorithm:
- Uses C3 linearization (Python)

Purpose:
- Ensure consistent method lookup
- Resolve conflicts in inheritance`,
    
    keyPoints: [
        'Defines method lookup order',
        'Important in multiple inheritance',
        'Prevents ambiguity',
        'Uses linearization algorithm'
    ],
    
    examples: [
        'Example: Class A → B → C, method search follows order',
        'Example: Diamond problem resolved using MRO'
    ],
    
    difficulty: 'Hard',
    tags: ['mro', 'inheritance'],
    sourceAttribution: 'Internal'
},
]

export const seedCSFundamentalTopics = async () => {
    try {
        for (const topic of sampleTopics) {
            await CSFundamental.updateOne(
                { title: topic.title, subject: topic.subject }, 
                { $set: topic }, 
                { upsert: true } 
            )
        }

        console.log('CS Fundamental topics seeded (upsert)')
    } catch (error) {
        console.error('Error seeding CS Fundamental topics:', error.message)
    }
}
