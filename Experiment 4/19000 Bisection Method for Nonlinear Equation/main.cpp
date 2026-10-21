#include <cstdio>

using namespace std;

double f(double x) {
    return x * x * x - 2.0 * x - 2.0;
}

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        double a, b;
        scanf("%lf%lf", &a, &b);
        while ((b - a) / 2.0 > 0.4e-14) {
            double x = (a + b) / 2.0;
            if (f(a) * f(x) > 0.0) a = x;
            else b = x;
        }
        printf("%.15f %.15f %.15f\n", a, b, (a + b) / 2.0);
    }
    return 0;
}
