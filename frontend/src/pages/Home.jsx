import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import {
  ScanLine,
  BarChart3,
  FolderOpen,
  Lock,
  Settings,
  Smartphone,
  Shield,
  Mic,
  PieChart,
  Bell,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  ArrowRight,   
   
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(null);

  const handleGetStarted = () => {
    navigate('/signup'); // Redirect to Sign Up page
  };

  const handleLogin = () => {
    navigate('/login'); // Redirect to Login page
  };

  const handleStepClick = (stepNumber) => {
    setActiveStep(activeStep === stepNumber ? null : stepNumber);
  };
const scrollToFeatures = () => {
  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  }
};
// ✅ Function to scroll to the How It Works section
const scrollToHowItWorks = () => {
  const howItWorksSection = document.getElementById('how-it-works');
  if (howItWorksSection) {
    howItWorksSection.scrollIntoView({ behavior: 'smooth' });
  }
};


  // 🔹 Features array
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: "Smart Dashboard Insights",
      description: "View your spending at a glance with analytics, category breakdowns, and AI-powered recommendations.",
      highlight: true,
      stats: "Instant insights",
    },
    {
      icon: <FolderOpen className="w-8 h-8 text-purple-600" />,
      title: "Expense Management",
      description: "Add, edit, and categorize expenses quickly. Track daily costs and stay organized.",
      highlight: false,
      stats: "Fast entry",
    },
    {
      icon: <PieChart className="w-8 h-8 text-indigo-600" />,
      title: "Reports & History",
      description: "Generate reports and review spending history to plan smarter and prepare for taxes.",
      highlight: false,
      stats: "Detailed trends",
    },
    {
      icon: <Bell className="w-8 h-8 text-red-600" />,
      title: "Smart Alerts",
      description: "Get notified about high spend, duplicates, and emergency expenses so you never miss a beat.",
      highlight: false,
      stats: "Proactive alerts",
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "Secure Login",
      description: "Protected authentication keeps your financial data safe and private.",
      highlight: false,
      stats: "Secure sessions",
    },
    {
      icon: <Settings className="w-8 h-8 text-yellow-600" />,
      title: "Custom Budgets",
      description: "Define your salary and budget goals to keep spending on track.",
      highlight: false,
      stats: "Personalized planning",
    },
  ];

  // 🔹 Steps array (workflow)
  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      description: "Sign up quickly and securely so your spending stays private and protected.",
      details: [
        "Easy email/password signup",
        "Secure authentication",
        "Privacy-first design"
      ],
      icon: <Shield className="w-6 h-6" />,
      color: "blue"
    },
    {
      number: 2,
      title: "Set Your Salary & Budget",
      description: "Tell us your monthly salary so the app can help you plan and stay within your budget.",
      details: [
        "Add monthly salary",
        "Track remaining budget",
        "Get smart budget tips"
      ],
      icon: <Settings className="w-6 h-6" />,
      color: "green"
    },
    {
      number: 3,
      title: "Log Expenses Easily",
      description: "Add expenses manually with categories and descriptions—fast and flexible.",
      details: [
        "Add/edit/delete expenses",
        "Choose categories",
        "Avoid duplicates with smart checks"
      ],
      icon: <FolderOpen className="w-6 h-6" />,
      color: "purple"
    },
    {
      number: 4,
      title: "See Analytics & Recommendations",
      description: "Use your spending data to get clear insights and helpful budgeting tips.",
      details: [
        "Top spending categories",
        "Emergency spend alerts",
        "Actionable recommendations"
      ],
      icon: <BarChart3 className="w-6 h-6" />,
      color: "yellow"
    },
    {
      number: 5,
      title: "Track & Review Reports",
      description: "Review monthly expenses and export data when you need it.",
      details: [
        "View expense history",
        "Access reports anytime",
        "Prepare for taxes or planning"
      ],
      icon: <PieChart className="w-6 h-6" />,
      color: "red"
    }
  ];

  return (
    <div className="home-container">
      
      {/* 🔹 Navbar */}
      <header className="home-header">
  <div className="logo">Personal Finance Advisor</div>
  <div className="header-actions">
    <button className="nav-btn" onClick={scrollToFeatures}>Features</button>
    <button className="nav-btn" onClick={scrollToHowItWorks}>How It Works</button>
    <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
  </div>
</header>


   
        <section className="hero-section">
        <div className="hero-text">
          <h1>Track your expenses smarter with bills scan & voice entry.</h1>
          <p>Save time, simplify expense tracking, and gain insights instantly.</p>
          <div className="hero-buttons">
            <button onClick={handleGetStarted}>Get Started</button>
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </section>

      {/* 🔹 Features Section */}
      
      <section id="features" className="features-section">
        <h2 className="section-title">Powerful Features for Smart Expense Tracking</h2>
        <p className="section-description">Everything you need to take control of your finances and make informed decisions</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card ${feature.highlight ? 'highlight' : ''}`}>
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.stats && <span className="feature-stats">{feature.stats}</span>}
            </div>
          ))}
        </div>
      </section>
      <section id="how-it-works" className="steps-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">Get started in 5 simple steps and transform how you manage expenses</p>
          </div>
          <div className="steps-container">
            {steps.map((step) => (
              <div key={step.number} className={`step-item ${activeStep === step.number ? 'step-active' : ''}`}>
                <div className="step-header" onClick={() => handleStepClick(step.number)}>
                  <div className={`step-number step-${step.color}`}>{step.number}</div>
                  <div className="step-info">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-toggle">
                    {activeStep === step.number ? (
                      <ChevronUp className="toggle-icon" />
                    ) : (
                      <ChevronDown className="toggle-icon" />
                    )}
                  </div>
                </div>
                <div className={`step-details ${activeStep === step.number ? 'step-details-open' : ''}`}>
                  <div className="step-details-content">
                    <ul className="step-list">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="step-list-item">
                          <CheckCircle className="check-icon" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content animate-on-scroll" id="cta-content">
            <h2 className="cta-title">Ready to Take Control of Your Expenses?</h2>
            <p className="cta-description">
              Join thousands of users who have simplified their expense tracking with Autotracker
            </p>
            <div className="cta-actions">
              <button className="btn-primary btn-large cta-primary"
               onClick={handleGetStarted} 
               >
                Start Free Trial
                <ArrowRight className="btn-icon" />
              </button>
              
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <CheckCircle className="cta-feature-icon" />
                <span>14-day free trial</span>
              </div>
              <div className="cta-feature">
                <CheckCircle className="cta-feature-icon" />
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <CheckCircle className="cta-feature-icon" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    

    </div>
  );
}

export default Home;
