import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Code, Globe, Menu, Server, Shield, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function NetixLanding() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [initialView, setInitialView] = useState(true);
    const animatedElementsRef = useRef([]);
    
    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            // More sensitive scroll detection for initial view
            const isScrolled = window.scrollY > 5;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
                
                // Set initial view to false once user has scrolled
                if (isScrolled && initialView) {
                    // Use setTimeout to create a smoother transition
                    setTimeout(() => {
                        setInitialView(false);
                    }, 100);
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled, initialView]);

    // Handle scroll animations
    useEffect(() => {
        const handleScrollAnimation = () => {
            // Handle regular animations
            const elements = document.querySelectorAll('.scroll-fade-in, .scroll-fade-in-left, .scroll-fade-in-right, .scroll-scale-in, .scroll-rotate-in, .sequence-item, .tech-reveal, .data-flow, .hidden-until-scroll');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                // More gradual threshold - start animation when element is 20% into the viewport
                const triggerPoint = window.innerHeight * 0.8;
                const isVisible = (elementTop < triggerPoint) && (elementBottom > 0);
                
                // Only add the visible class if it's not already there
                if (isVisible && !element.classList.contains('visible')) {
                    // Use requestAnimationFrame for smoother animation
                    requestAnimationFrame(() => {
                        element.classList.add('visible');
                    });
                }
            });
            
            // Special handling for solutions section - trigger earlier
            const solutionsSection = document.querySelector('.solutions-section');
            if (solutionsSection && solutionsSection.classList.contains('ready-for-animation')) {
                const solutionsElements = document.querySelectorAll('.solutions-fade-in, .solutions-section .scroll-fade-in-left, .solutions-section .scroll-fade-in, .solutions-section .scroll-fade-in-right');
                
                solutionsElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    // Much earlier trigger point - 40% of viewport height from the bottom
                    const triggerPoint = window.innerHeight * 0.6;
                    const isVisible = (elementTop < triggerPoint);
                    
                    if (isVisible && !element.classList.contains('visible')) {
                        requestAnimationFrame(() => {
                            element.classList.add('visible');
                        });
                    }
                });
            }
            
            // Handle initial view elements
            const initialElements = document.querySelectorAll('.initial-load-only');
            if (scrolled) {
                initialElements.forEach(element => {
                    element.classList.add('scrolled');
                });
            }
        };
        // Initial check with a small delay to ensure smooth first animation
        setTimeout(() => {
            handleScrollAnimation();
            
            // Add a special class to the solutions section after a delay
            // This ensures it's not visible immediately on page load
            setTimeout(() => {
                const solutionsSection = document.querySelector('.solutions-section');
                if (solutionsSection) {
                    solutionsSection.classList.add('ready-for-animation');
                }
            }, 500);
        }, 300);
        
        // Add scroll event listener with throttling for better performance
        let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
        const throttledScrollHandler = () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScrollAnimation();
                    scrollTimeout = null;
                }, 50); // 50ms throttle
            }
        };
        
        window.addEventListener('scroll', throttledScrollHandler);
        
        return () => {
            window.removeEventListener('scroll', throttledScrollHandler);
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, []);


    return (
        <>
            <Head title="NETiX - Network Infrastructure Monitoring">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <link rel="icon" href="/logo.png" type="image/png" />
                <meta name="description" content="NETiX delivers comprehensive network monitoring and management solutions to help businesses optimize their network infrastructure." />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-[#f5f5f5] relative grid-background-enhanced">
                {/* Particle Background - positioned as fixed overlay */}
                {/* Enhanced global dust particle field - positioned with higher z-index */}
                {/* No particles */}
                {/* Header/Navigation - hidden in initial view */}
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${initialView ? 'opacity-0' : ''} ${scrolled ? 'bg-[#252525]/90 backdrop-blur-md shadow-md glass-effect' : 'bg-[#252525]/50 backdrop-blur-sm'}`}>
                    <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="NETiX Logo" className="h-10 mr-2" />
                            <h1 className="text-2xl font-tech-heading font-bold text-netix-primary digital-noise" data-text="NETiX">NETiX</h1>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden space-x-8 md:flex font-tech">
                            <a href="#solutions" className="text-sm font-medium transition-all duration-300 hover:text-netix-primary animated-underline">Solutions</a>
                            <a href="#features" className="text-sm font-medium transition-all duration-300 hover:text-netix-primary animated-underline">Features</a>
                            <a href="#platform" className="text-sm font-medium transition-all duration-300 hover:text-netix-primary animated-underline">Platform</a>
                            <a href="#testimonials" className="text-sm font-medium transition-all duration-300 hover:text-netix-primary animated-underline">Testimonials</a>
                        </nav>
                        
                        {/* Desktop CTA Buttons */}
                        <div className="hidden items-center space-x-4 md:flex">
                            <Link
                                href={route('login')}
                                className="rounded-md px-4 py-2 text-sm font-tech font-medium transition-all duration-300 hover:bg-[#1a1a2e] hover:text-netix-primary border border-netix-primary/30 hover:border-netix-primary"
                                style={{ animation: 'borderFlow 3s ease-in-out infinite' }}
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-md bg-netix-primary px-4 py-2 text-sm font-tech font-medium text-[#1a1a1a] shadow-sm transition-all duration-300 hover:bg-netix-primary/90"
                                style={{ animation: 'buttonPulse 2s infinite' }}
                            >
                                Get Started
                            </Link>
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button
                            className="flex items-center md:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </header>
                
                {/* Mobile Menu */}
                <div className={`fixed inset-0 z-50 transform bg-[#252525] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex h-20 items-center justify-between px-6">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="NETiX Logo" className="h-8 mr-2" />
                            <h1 className="text-2xl font-tech-heading font-bold text-netix-primary">NETiX</h1>
                        </div>
                        <button
                            className="flex items-center text-netix-primary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col px-6 py-8 font-tech">
                        <a
                            href="#solutions"
                            className="border-b border-netix-primary/20 py-4 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Solutions
                        </a>
                        <a
                            href="#features"
                            className="border-b border-netix-primary/20 py-4 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Features
                        </a>
                        <a
                            href="#platform"
                            className="border-b border-netix-primary/20 py-4 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Platform
                        </a>
                        <a
                            href="#testimonials"
                            className="border-b border-netix-primary/20 py-4 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Testimonials
                        </a>
                        <div className="mt-8 flex flex-col space-y-4">
                            <Link
                                href={route('login')}
                                className="rounded-md border border-netix-primary/30 px-4 py-2 text-center text-sm font-tech font-medium hover:border-netix-primary hover:text-netix-primary"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ animation: 'borderFlow 3s ease-in-out infinite' }}
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-md bg-netix-primary px-4 py-2 text-center text-sm font-tech font-medium text-[#1a1a1a] hover:bg-netix-primary/90"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ animation: 'buttonPulse 2s infinite' }}
                            >
                                Get Started
                            </Link>
                        </div>
                    </nav>
                </div>

                {/* Hero Section */}
                <section className="relative mt-20 overflow-hidden py-24 sm:py-32">
                    {/* Hero section content only - no DNA strand */}
                    <div className="absolute inset-0 bg-[#1a1a1a]/90 dark-gradient-radial" style={{ backgroundImage: 'radial-gradient(circle at center, #252525 0%, #1a1a1a 100%)' }}></div>
                    <div className="container relative mx-auto px-6 lg:px-8">
                        {/* Initial view - clean and modern splash screen */}
                        <div className={`mx-auto max-w-4xl text-center relative ${initialView ? 'h-[80vh] flex flex-col justify-center items-center' : ''}`}>
                            {/* Enhanced radar scan effect - only visible in initial view */}
                            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${initialView ? 'opacity-20' : 'opacity-0'} transition-all duration-1500 z-0`}>
                                <div className="radar-scan" style={{ animation: initialView ? 'enhanced-radar-scan 8s cubic-bezier(0.16, 1, 0.3, 1) infinite' : 'radar-scan 8s linear infinite' }}></div>
                            </div>
                            
                            {/* Logo and company name with enhanced effects */}
                            <div className={`mb-8 transition-all duration-1500 ${initialView ? 'scale-125' : 'initial-load-only'}`}>
                                <div className="flex flex-col items-center justify-center">
                                    <img
                                        src="/logo.png"
                                        alt="NETiX Logo"
                                        className={`h-32 mb-6 ${initialView ? 'animate-float' : ''}`}
                                        style={{
                                            animation: initialView ? 'float 6s ease-in-out infinite' : 'none'
                                        }}
                                    />
                                    <h1
                                        className={`text-7xl font-tech-heading font-bold tracking-tight inline-block hero-glitch bloom-effect ${initialView ? 'text-glow-intense' : 'text-glow'}`}
                                        data-text="NETiX"
                                    >
                                        NETiX
                                    </h1>
                                </div>
                            </div>
                            
                            {/* Enhanced tagline with better styling */}
                            <p
                                className={`text-xl font-tech text-netix-primary transition-all duration-1500 ${initialView ? 'opacity-90' : 'opacity-0'}`}
                                style={{ letterSpacing: '1px' }}
                            >
                                NETWORK INFRASTRUCTURE MONITORING
                            </p>
                            
                            {/* Subtle "Scroll to explore" hint - only visible in initial view */}
                            <div
                                className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${initialView ? 'opacity-70' : 'opacity-0'}`}
                                style={{ animation: initialView ? 'bounce 2s infinite' : 'none' }}
                            >
                                <p className="text-sm font-tech text-netix-light-muted mb-2">Scroll to explore</p>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                                    <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            
                            <h2 className="mb-6 text-3xl font-tech-heading font-bold tracking-tight tech-reveal animate-fade-in-up">
                                Network Infrastructure <span className="text-netix-primary text-glow">Monitoring</span>
                            </h2>
                            <p className="mx-auto mb-10 max-w-2xl text-lg font-tech text-netix-light-muted sequence-item delay-300 animate-fade-in-up delay-200">
                                NETiX delivers comprehensive network monitoring and management solutions to help businesses optimize,
                                scale, and succeed in today's digital landscape.
                            </p>
                            <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sequence-item delay-500 animate-fade-in-up delay-300 relative z-10">
                                <a
                                    href={route('register')}
                                    className="inline-flex items-center justify-center rounded-md bg-netix-primary px-6 py-3 text-base font-tech font-medium text-[#1a1a1a] shadow-md transition-all duration-300 hover:bg-netix-primary/90 relative z-20"
                                    style={{ animation: 'buttonPulse 2s infinite', pointerEvents: 'auto' }}
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                                <a
                                    href="#solutions"
                                    className="hover-lift inline-flex items-center justify-center rounded-md border border-netix-primary/50 bg-transparent px-6 py-3 text-base font-tech font-medium text-netix-primary shadow-sm transition-all duration-300 hover:border-netix-primary relative z-20"
                                    style={{ animation: 'borderFlow 3s ease-in-out infinite', pointerEvents: 'auto' }}
                                >
                                    Explore Solutions
                                </a>
                            </div>
                        </div>
                        
                        {/* Decorative elements - minimal in initial view */}
                        <div className={`absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-netix-primary/10 transition-opacity duration-1000 ${initialView ? 'opacity-5' : 'opacity-10'} z-0`}></div>
                        <div className={`absolute -top-16 -right-16 h-64 w-64 rounded-full bg-netix-primary/10 transition-opacity duration-1000 ${initialView ? 'opacity-5' : 'opacity-10'} z-0`}></div>
                        
                        {/* Tech grid lines - minimal in initial view */}
                        <div className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${initialView ? 'opacity-5' : 'opacity-20'} z-0`}>
                            <div className="absolute inset-0 border-t border-l border-r border-netix-primary/20 grid grid-cols-12 gap-4">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="h-full border-r border-netix-primary/10"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solutions Section */}
                <section id="solutions" className="py-24 relative solutions-section">
                    <div className="absolute inset-0 dark-gradient-bg" style={{ backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #252525 100%)', zIndex: -1 }}></div>
                    <div className="absolute inset-0 overflow-hidden opacity-10">
                        <div className="absolute inset-0 border-t border-l border-r border-netix-primary/20 grid grid-cols-12 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="h-full border-r border-netix-primary/10"></div>
                            ))}
                        </div>
                    </div>
                    <div className="container mx-auto px-6 lg:px-8 relative">
                        <div className="mx-auto max-w-4xl text-center solutions-fade-in tech-reveal">
                            <h2 className="mb-4 text-3xl font-tech-heading font-bold tracking-tight sm:text-4xl">Our Solutions</h2>
                            <p className="mx-auto mb-16 max-w-2xl text-lg font-tech leading-relaxed text-[#b0b0b0]">
                                Advanced network infrastructure monitoring solutions designed to ensure optimal
                                performance, security, and reliability.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* Solution 1 */}
                            <div className="tech-card hover-lift rounded-lg p-8 transition-all solutions-fade-in sequence-item delay-300 data-flow glass-effect enhanced-card accent-border bloom-effect">
                                <div className="mb-4 inline-flex rounded-full bg-netix-primary/20 p-3 text-netix-primary transition-transform duration-500 hover:rotate-12">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <h3 className="mb-3 text-xl font-tech-heading font-bold">Network Visibility</h3>
                                <p className="mb-4 font-tech text-netix-light-muted">
                                    Real-time monitoring and analytics for your entire network infrastructure with comprehensive dashboards.
                                </p>
                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">End-to-end visibility</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">Performance metrics</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">Custom alerting</span>
                                    </li>
                                </ul>
                                <a href="#" className="group inline-flex items-center text-sm font-tech font-medium text-netix-primary transition-colors duration-300 hover:text-netix-primary/80">
                                    Learn more
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            </div>

                            {/* Solution 2 */}
                            <div className="tech-card hover-lift rounded-lg p-8 transition-all solutions-fade-in sequence-item delay-500 data-flow glass-effect enhanced-card accent-border bloom-effect">
                                <div className="mb-4 inline-flex rounded-full bg-netix-primary/20 p-3 text-netix-primary transition-transform duration-500 hover:rotate-12">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h3 className="mb-3 text-xl font-tech-heading font-bold">Network Security</h3>
                                <p className="mb-4 font-tech text-netix-light-muted">
                                    Proactive network security monitoring to identify and mitigate threats before they impact your business.
                                </p>
                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">Anomaly detection</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">Threat intelligence</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">Automated remediation</span>
                                    </li>
                                </ul>
                                <a href="#" className="group inline-flex items-center text-sm font-tech font-medium text-netix-primary transition-colors duration-300 hover:text-netix-primary/80">
                                    Learn more
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            </div>

                            {/* Solution 3 */}
                            <div className="tech-card hover-lift rounded-lg p-8 transition-all solutions-fade-in sequence-item delay-700 data-flow glass-effect enhanced-card accent-border bloom-effect">
                                <div className="mb-4 inline-flex rounded-full bg-netix-primary/20 p-3 text-netix-primary transition-transform duration-500 hover:rotate-12">
                                    <Code className="h-6 w-6" />
                                </div>
                                <h3 className="mb-3 text-xl font-tech-heading font-bold">Automation & Analytics</h3>
                                <p className="mb-4 font-tech text-netix-light-muted">
                                    Advanced analytics and automation to optimize network performance and reduce manual intervention.
                                </p>
                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">Predictive analytics</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">Automated workflows</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="text-sm font-tech">Custom reporting</span>
                                    </li>
                                </ul>
                                <a href="#" className="group inline-flex items-center text-sm font-tech font-medium text-netix-primary transition-colors duration-300 hover:text-netix-primary/80">
                                    Learn more
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-[#1a1a1a] py-24 relative">
                    <div className="absolute inset-0 dark-gradient-top" style={{ backgroundImage: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)', zIndex: -1 }}></div>
                    <div className="absolute inset-0 overflow-hidden opacity-10">
                        <div className="absolute inset-0 border-t border-l border-r border-netix-primary/20 grid grid-cols-12 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="h-full border-r border-netix-primary/10"></div>
                            ))}
                        </div>
                    </div>
                    <div className="container mx-auto px-6 lg:px-8 relative">
                        <div className="mx-auto max-w-4xl text-center scroll-fade-in tech-reveal">
                            <h2 className="mb-4 text-3xl font-tech-heading font-bold tracking-tight sm:text-4xl">Why Choose NETiX</h2>
                            <p className="mx-auto mb-16 max-w-2xl text-lg font-tech leading-relaxed text-[#b0b0b0]">
                                Our network monitoring platform provides unmatched visibility, security, and control over your entire network infrastructure.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="flex flex-col items-start rounded-lg border border-netix-primary/20 bg-[#252525] p-6 scroll-scale-in sequence-item delay-200 glass-effect enhanced-card">
                                <div className="mb-4 rounded-full bg-netix-primary/20 p-3 text-netix-primary">
                                    <Server className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-tech-heading font-bold">AI-Powered Monitoring</h3>
                                <p className="font-tech text-[#b0b0b0]">
                                    Machine learning algorithms that detect patterns, predict issues, and provide actionable insights for network optimization.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex flex-col items-start rounded-lg border border-netix-primary/20 bg-[#252525] p-6 scroll-scale-in sequence-item delay-400 glass-effect enhanced-card">
                                <div className="mb-4 rounded-full bg-netix-primary/20 p-3 text-netix-primary">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-tech-heading font-bold">Real-Time Alerts</h3>
                                <p className="font-tech text-[#b0b0b0]">
                                    Instant notifications about network issues through multiple channels, allowing for rapid response and minimal downtime.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex flex-col items-start rounded-lg border border-netix-primary/20 bg-[#252525] p-6 scroll-scale-in sequence-item delay-600 glass-effect enhanced-card">
                                <div className="mb-4 rounded-full bg-netix-primary/20 p-3 text-netix-primary">
                                    <Code className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-tech-heading font-bold">Scalable Architecture</h3>
                                <p className="font-tech text-[#b0b0b0]">
                                    Designed to grow with your network, from small businesses to large enterprises with complex multi-site deployments.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="platform" className="py-20">
                    <div className="absolute inset-0 dark-gradient-bg" style={{ backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #252525 100%)', zIndex: -1 }}></div>
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center scroll-fade-in tech-reveal">
                            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Platform</h2>
                            <p className="mx-auto mb-16 max-w-2xl text-lg font-tech text-[#b0b0b0]">
                                A comprehensive network monitoring solution that provides complete visibility and control
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="rounded-lg border border-netix-primary/20 bg-[#252525] p-8 scroll-fade-in-left data-flow glass-effect enhanced-card accent-border">
                                <h3 className="mb-4 text-xl font-tech-heading font-bold">Key Features</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center sequence-item delay-100">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Unified dashboard for all network devices</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-200">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Automated device discovery and mapping</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-300">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Performance metrics and bandwidth analysis</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-400">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Customizable alerts and notifications</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-500">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Historical data and trend analysis</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-600">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">API integration with existing tools</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-lg border border-netix-primary/20 bg-[#252525] p-8 scroll-fade-in-right data-flow glass-effect enhanced-card accent-border">
                                <h3 className="mb-4 text-xl font-tech-heading font-bold">Supported Technologies</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center sequence-item delay-200">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Wired and wireless networks</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-300">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Routers, switches, and access points</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-400">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Cloud infrastructure monitoring</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-500">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">SD-WAN and VPN connections</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-600">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">IoT device monitoring</span>
                                    </li>
                                    <li className="flex items-center sequence-item delay-700">
                                        <CheckCircle className="mr-2 h-4 w-4 text-netix-primary" />
                                        <span className="font-tech">Multi-vendor environment support</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* No network visualization section */}
                    </div>
                </section>

                <section id="testimonials" className="bg-[#1a1a1a] py-24 relative">
                    <div className="absolute inset-0 dark-gradient-bottom" style={{ backgroundImage: 'linear-gradient(to top, #252525 0%, #1a1a1a 100%)', zIndex: -1 }}></div>
                    <div className="absolute inset-0 overflow-hidden opacity-10">
                        <div className="absolute inset-0 border-t border-l border-r border-netix-primary/20 grid grid-cols-12 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="h-full border-r border-netix-primary/10"></div>
                            ))}
                        </div>
                    </div>
                    <div className="container mx-auto px-6 lg:px-8 relative">
                        <div className="mx-auto max-w-4xl text-center scroll-fade-in tech-reveal">
                            <h2 className="mb-4 text-3xl font-tech-heading font-bold tracking-tight sm:text-4xl">What Our Clients Say</h2>
                            <p className="mx-auto mb-16 max-w-2xl text-lg font-tech leading-relaxed text-[#b0b0b0]">
                                Hear from organizations that have transformed their operations with NETiX solutions.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* Testimonial 1 */}
                            <div className="rounded-lg border border-netix-primary/20 bg-[#252525] p-8 scroll-fade-in-left sequence-item delay-200 glass-effect enhanced-card">
                                <div className="mb-4 flex items-center">
                                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-netix-primary/20">
                                        <div className="flex h-full w-full items-center justify-center text-xl font-tech font-bold text-netix-primary">
                                            AC
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-tech font-bold">Alex Chen</h4>
                                        <p className="text-sm font-tech text-[#b0b0b0]">CTO, TechGlobal Inc.</p>
                                    </div>
                                </div>
                                <p className="italic font-tech text-[#b0b0b0]">
                                    "NETiX's network monitoring platform has given us unprecedented visibility into our infrastructure.
                                    We've reduced network downtime by 85% and can now proactively address issues before they impact our operations."
                                </p>
                            </div>

                            {/* Testimonial 2 */}
                            <div className="rounded-lg border border-netix-primary/20 bg-[#252525] p-8 scroll-fade-in sequence-item delay-400 glass-effect enhanced-card">
                                <div className="mb-4 flex items-center">
                                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-netix-primary/20">
                                        <div className="flex h-full w-full items-center justify-center text-xl font-tech font-bold text-netix-primary">
                                            SJ
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-tech font-bold">Sarah Johnson</h4>
                                        <p className="text-sm font-tech text-[#b0b0b0]">CEO, Innovate Solutions</p>
                                    </div>
                                </div>
                                <p className="italic font-tech text-[#b0b0b0]">
                                    "With NETiX's monitoring solution, we've gained complete visibility across our multi-site network.
                                    The automated alerts and intuitive dashboards have made managing our complex infrastructure significantly easier."
                                </p>
                            </div>

                            {/* Testimonial 3 */}
                            <div className="rounded-lg border border-netix-primary/20 bg-[#252525] p-8 scroll-fade-in-right sequence-item delay-600 glass-effect enhanced-card">
                                <div className="mb-4 flex items-center">
                                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-netix-primary/20">
                                        <div className="flex h-full w-full items-center justify-center text-xl font-tech font-bold text-netix-primary">
                                            MR
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-tech font-bold">Michael Rodriguez</h4>
                                        <p className="text-sm font-tech text-[#b0b0b0]">CISO, SecureBank</p>
                                    </div>
                                </div>
                                <p className="italic font-tech text-[#b0b0b0]">
                                    "NETiX's network security monitoring identified and prevented a potential data breach that our
                                    previous tools missed. The real-time alerts and automated remediation capabilities are game-changers."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="section-divider"></div>

                {/* Contact section removed */}

                {/* Footer */}
                <footer className="border-t border-netix-primary/20 py-16 relative circuit-texture">
                    <div className="absolute inset-0 dark-gradient-bg" style={{ backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #252525 100%)', zIndex: -1 }}></div>
                    <div className="absolute inset-0 overflow-hidden opacity-5">
                        <div className="absolute inset-0 border-t border-l border-r border-netix-primary/20 grid grid-cols-12 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="h-full border-r border-[#00f0ff]/10"></div>
                            ))}
                        </div>
                    </div>
                    <div className="container mx-auto px-6 lg:px-8 relative">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="scroll-fade-in-left">
                                <div className="flex items-center mb-4">
                                    <img src="/logo.png" alt="NETiX Logo" className="h-8 mr-2" />
                                    <h3 className="text-lg font-tech-heading font-bold text-gradient-tech">NETiX</h3>
                                </div>
                                <p className="mb-4 text-sm font-tech text-[#f0f5ff]/80">
                                    Advanced network monitoring solutions for complete visibility and control.
                                </p>
                            </div>
                            <div className="scroll-fade-in">
                                <h3 className="mb-4 text-lg font-tech-heading font-bold text-[#f0f5ff]">Solutions</h3>
                                <ul className="space-y-2 text-sm font-tech text-[#f0f5ff]/80">
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Network Visibility</a></li>
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Network Security</a></li>
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Automation & Analytics</a></li>
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Monitoring Platform</a></li>
                                </ul>
                            </div>
                            <div className="scroll-fade-in">
                                <h3 className="mb-4 text-lg font-tech-heading font-bold text-[#f0f5ff]">Company</h3>
                                <ul className="space-y-2 text-sm font-tech text-[#f0f5ff]/80">
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">About Us</a></li>
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Careers</a></li>
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Blog</a></li>
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Contact</a></li>
                                </ul>
                            </div>
                            <div className="scroll-fade-in-right">
                                <h3 className="mb-4 text-lg font-tech-heading font-bold text-[#f0f5ff]">Legal</h3>
                                <ul className="space-y-2 text-sm font-tech text-[#f0f5ff]/80">
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Privacy Policy</a></li>
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Terms of Service</a></li>
                                    <li><a href="#" className="transition-colors duration-300 hover:text-[#00f0ff] animated-underline">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-[#00f0ff]/20 pt-8 text-center scroll-fade-in">
                            <p className="text-sm font-tech text-[#f0f5ff]/80">
                                &copy; {new Date().getFullYear()} <span className="text-gradient">NETiX</span>. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}