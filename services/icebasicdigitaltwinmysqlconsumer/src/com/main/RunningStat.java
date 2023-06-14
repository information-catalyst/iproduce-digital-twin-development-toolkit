/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import static java.lang.Math.sqrt;

/**
 *
 * @author mitch
 */
public class RunningStat
    {
    
    private int m_n;
    private double m_oldM, m_newM, m_oldS, m_newS;
    
    public RunningStat()
    {
        int m_n = 0;
    }

        void Clear()
        {
            m_n = 0;
        }

        void Push(double x)
        {
            m_n++;

            // See Knuth TAOCP vol 2, 3rd edition, page 232
            if (m_n == 1)
            {
                m_oldM = m_newM = x;
                m_oldS = 0.0;
            }
            else
            {
                m_newM = m_oldM + (x - m_oldM)/m_n;
                m_newS = m_oldS + (x - m_oldM)*(x - m_newM);
    
                // set up for next iteration
                m_oldM = m_newM; 
                m_oldS = m_newS;
            }
        }

        int NumDataValues() 
        {
            return m_n;
        }

        double Mean() 
        {
            return (m_n > 0) ? m_newM : 0.0;
        }

        double Variance() 
        {
            return ( (m_n > 1) ? m_newS/(m_n - 1) : 0.0 );
        }

        double StandardDeviation() 
        {
            return sqrt( Variance() );
        }

    };