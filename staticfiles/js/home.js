import React from 'react'

import FeatureCard from './feature-card'
import Question1 from './question1'
import projectStyles from '.style.module.css'
import styles from './home.module.css'

const Home = (props) => {
  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <header
          data-thq="thq-navbar"
          className={` ${projectStyles['navbar-container']} ${styles['navbar-interactive']} `}
        >
          <span className={projectStyles['logo']}>NIBO</span>
          <div data-thq="thq-navbar-nav" className={styles['desktop-menu']}>
            <nav className={styles['links']}>
              <span className={projectStyles['body-small']}>Home</span>
              <span
                className={` ${styles['nav22']} ${projectStyles['body-small']} `}
              >
                Features
              </span>
              <span
                className={` ${styles['nav32']} ${projectStyles['body-small']} `}
              >
                Demo
              </span>
              <span
                className={` ${styles['nav52']} ${projectStyles['body-small']} `}
              >
                Contact
              </span>
            </nav>
            <div className={styles['buttons']}>
              <button
                className={` ${styles['login']} ${projectStyles['button-flat']} `}
              >
                Student Login
              </button>
              <button className={projectStyles['button-filled']}>
                Admin Registration
              </button>
            </div>
          </div>
          <div data-thq="thq-burger-menu" className={styles['burger-menu']}>
            <svg
              viewBox="0 0 1024 1024"
              className={` ${styles['icon']} ${projectStyles['social-icons']} `}
            >
              <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
            </svg>
          </div>
          <div
            data-thq="thq-mobile-menu"
            className={` ${styles['mobile-menu1']} ${projectStyles['mobile-menu']} `}
          >
            <div className={styles['nav']}>
              <div className={styles['top']}>
                <span className={projectStyles['logo']}>NIBO</span>
                <div data-thq="thq-close-menu" className={styles['close-menu']}>
                  <svg
                    viewBox="0 0 1024 1024"
                    className={` ${styles['icon02']} ${projectStyles['social-icons']} `}
                  >
                    <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                  </svg>
                </div>
              </div>
              <nav className={styles['links1']}>
                <span
                  className={` ${styles['nav121']} ${projectStyles['body-small']} `}
                >
                  Home
                </span>
                <span
                  className={` ${styles['nav221']} ${projectStyles['body-small']} `}
                >
                  Features
                </span>
                <span
                  className={` ${styles['nav321']} ${projectStyles['body-small']} `}
                >
                  Demo
                </span>
                <span
                  className={` ${styles['nav42']} ${projectStyles['body-small']} `}
                >
                  Pricing
                </span>
                <span
                  className={` ${styles['nav521']} ${projectStyles['body-small']} `}
                >
                  Contact
                </span>
              </nav>
              <div className={styles['buttons1']}>
                <button className={projectStyles['button-flat']}>Login</button>
                <button className={projectStyles['button-filled']}>
                  Register
                </button>
              </div>
            </div>
            <div>
              <svg
                viewBox="0 0 950.8571428571428 1024"
                className={` ${styles['icon04']} ${projectStyles['social-icons']} `}
              >
                <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
              </svg>
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className={` ${styles['icon06']} ${projectStyles['social-icons']} `}
              >
                <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
              </svg>
              <svg
                viewBox="0 0 602.2582857142856 1024"
                className={` ${styles['icon08']} ${projectStyles['social-icons']} `}
              >
                <path d="M548 6.857v150.857h-89.714c-70.286 0-83.429 33.714-83.429 82.286v108h167.429l-22.286 169.143h-145.143v433.714h-174.857v-433.714h-145.714v-169.143h145.714v-124.571c0-144.571 88.571-223.429 217.714-223.429 61.714 0 114.857 4.571 130.286 6.857z"></path>
              </svg>
            </div>
          </div>
        </header>
      </div>
      <div className={styles['hero']}>
        <div
          className={` ${projectStyles['hero-container']} ${styles['hero1']} `}
        >
          <div className={styles['container1']}>
            <h1
              className={` ${styles['hero-heading']} ${projectStyles['heading1']} `}
            >
              Ace Your Exams with Nibo Test Network
            </h1>
            <span
              className={` ${styles['hero-sub-heading']} ${projectStyles['body-large']} `}
            >
              <span>
                <span>
                  <span>The Ultimate CBT Exam Software</span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </span>
                <span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </span>
              </span>
              <span>
                <span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </span>
                <span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </span>
              </span>
            </span>
            <div className={styles['btn-group']}>
              <button className={projectStyles['button-filled']}>
                Admin Login
              </button>
              <button className={projectStyles['button-flat']}>
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['features']}>
        <div className={projectStyles['features-container']}>
          <div className={styles['features1']}>
            <div className={styles['container2']}>
              <span className={projectStyles['overline']}>
                <span>features</span>
                <br></br>
              </span>
              <h2
                className={` ${styles['features-heading']} ${projectStyles['heading2']} `}
              >
                Empowering Features of Nibo Test Network
              </h2>
              <span
                className={` ${styles['features-sub-heading']} ${projectStyles['body-large']} `}
              >
                <span>
                  <span>
                    <span>
                      Experience the power of our cutting-edge features for
                      seamless exam management
                    </span>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                  </span>
                  <span>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                  </span>
                </span>
                <span>
                  <span>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                  </span>
                  <span>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                  </span>
                </span>
              </span>
            </div>
            <div className={styles['container3']}>
              <FeatureCard
                heading="Customizable Exams"
                subHeading="Create exams tailored to your specific needs"
              ></FeatureCard>
              <FeatureCard
                heading="Real-time Monitoring"
                subHeading="Monitor exam progress and performance instantly"
              ></FeatureCard>
              <FeatureCard
                heading="Detailed Analytics"
                subHeading="Gain insights with comprehensive exam performance analytics"
              ></FeatureCard>
              <FeatureCard
                heading="Secure Testing Environment"
                subHeading="Ensure exam integrity with a secure testing environment"
              ></FeatureCard>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['banner']}>
        <div
          className={` ${projectStyles['banner-container']} ${styles['banner1']} `}
        >
          <h1
            className={` ${styles['banner-heading']} ${projectStyles['heading2']} `}
          >
            Revolutionize Your Exam Experience
          </h1>
          <span
            className={` ${styles['banner-sub-heading']} ${projectStyles['body-small']} `}
          >
            <span>
              <span>
                <span>
                  Nibo Test Network offers a cutting-edge Computer-Based Testing
                  (CBT) solution that simplifies exam administration, enhances
                  security, and provides detailed analytics for better insights.
                  With our user-friendly interface and robust features, you can
                  streamline your exam processes and elevate the testing
                  experience for both administrators and test-takers.
                </span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
              </span>
              <span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
              </span>
            </span>
            <span>
              <span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
              </span>
              <span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
              </span>
            </span>
          </span>
          <button className={projectStyles['button-filled']}>Learn More</button>
        </div>
      </div>
      <div className={styles['faq']}>
        <div className={projectStyles['faq-container']}>
          <div className={styles['faq1']}>
            <div className={styles['container4']}>
              <span className={projectStyles['overline']}>
                <span>FAQ</span>
                <br></br>
              </span>
              <h2
                className={` ${styles['text48']} ${projectStyles['heading2']} `}
              >
                Common questions
              </h2>
              <span
                className={` ${styles['text49']} ${projectStyles['body-large']} `}
              >
                <span>
                  Here are some of the most common questions that we get.
                </span>
                <br></br>
              </span>
            </div>
            <div className={styles['container5']}>
              <Question1
                answer="Nibo Test Network is a cbt exam software designed to streamline the exam process for both administrators and test-takers."
                question="What is Nibo Test Network?"
              ></Question1>
              <Question1
                answer="You can access Nibo Test Network by signing up for an account on our website and logging in to the platform."
                question="How can I access Nibo Test Network?"
              ></Question1>
              <Question1
                answer="Yes, Nibo Test Network is compatible with various devices including desktops, laptops, tablets, and smartphones."
                question="Is Nibo Test Network compatible with all devices?"
              ></Question1>
              <Question1
                answer="Yes, you can customize exams on Nibo Test Network by setting parameters such as time limits, question types, and difficulty levels."
                question="Can I customize exams on Nibo Test Network?"
              ></Question1>
              <Question1
                answer="Yes, we offer customer support to assist users with any questions or issues they may encounter while using Nibo Test Network."
                question="Is there customer support available for Nibo Test Network users?"
              ></Question1>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['footer']}>
        <footer
          className={` ${projectStyles['footer-container']} ${styles['footer1']} `}
        >
          <div className={styles['container6']}>
            <span className={projectStyles['logo']}>NIBO</span>
            <nav className={styles['nav1']}>
              <span className={projectStyles['body-small']}>Home</span>
              <span
                className={` ${styles['nav222']} ${projectStyles['body-small']} `}
              >
                Features
              </span>
              <span
                className={` ${styles['nav322']} ${projectStyles['body-small']} `}
              >
                Demo
              </span>
              <span
                className={` ${styles['nav421']} ${projectStyles['body-small']} `}
              >
                Pricing
              </span>
              <span
                className={` ${styles['nav522']} ${projectStyles['body-small']} `}
              >
                Contact
              </span>
            </nav>
          </div>
          <div className={styles['separator']}></div>
          <div className={styles['container7']}>
            <span
              className={` ${projectStyles['body-small']} ${styles['text52']} `}
            >
              © 2023 myCompany, All Rights Reserved.
            </span>
            <div className={styles['icon-group1']}>
              <svg
                viewBox="0 0 950.8571428571428 1024"
                className={` ${styles['icon10']} ${projectStyles['social-icons']} `}
              >
                <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
              </svg>
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className={` ${styles['icon12']} ${projectStyles['social-icons']} `}
              >
                <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
              </svg>
              <svg
                viewBox="0 0 602.2582857142856 1024"
                className={` ${styles['icon14']} ${projectStyles['social-icons']} `}
              >
                <path d="M548 6.857v150.857h-89.714c-70.286 0-83.429 33.714-83.429 82.286v108h167.429l-22.286 169.143h-145.143v433.714h-174.857v-433.714h-145.714v-169.143h145.714v-124.571c0-144.571 88.571-223.429 217.714-223.429 61.714 0 114.857 4.571 130.286 6.857z"></path>
              </svg>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
